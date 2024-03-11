import { PayloadRequest, TypeWithID } from 'payload/types'
// import { Response } from 'express'
import { Endpoint } from 'payload/config'
import { GetUrlParams, Git, RebuildSettings } from '../types';

import { Forbidden } from 'payload/errors'
//abstruct this
import { eventTrigger as githubEventTrigger,
getLetestRelease as githubLatestRelease,
createRelease as githubCreateRelease } from './githubApi';
import { giteaEventTrigger } from './giteaEventTrigger';

type TConfig = TypeWithID & Record<string, unknown> & Record<string, RebuildSettings>

const getRepositoryPath = (link: string) => {
	const url = new URL(link)
	return url.pathname.replace(/^\//, '')
}

const getHost = (link: string) => {
	const url = new URL(link)
	return url.host
}

const getTriggerUrl = ({type, link}: GetUrlParams) => {
	if (type === 'github') {
		return 'https://'
	}

	if (type === 'custom') {
		const url = new URL(link)
		return url.origin
	}
}

const triggerBuild = async ({type, token, link, env = 'prod'}: {type: Git,token: string, link: string, env: string }) => {
	if (type === 'github') {
		const repository = getRepositoryPath(link)
		return githubEventTrigger({token, repository, env})
	}

	if (type === 'custom') {
		const repository = getRepositoryPath(link)
		const host = getHost(link)
		return giteaEventTrigger({host, token, repository, issue: '1', env})
	}
}

const rebuildTriggerEndpoint: Endpoint = {
	path: '/rebuild-static',
	method: 'get', // get will work
	// root: true,
	handler: async (req: PayloadRequest, res) => {

		const {
			payload,
			user,
			query
		  } = req
		const env = query.env as string
        //get env from qury params to rebuild stage prod

		// const configs = await getRebuildTriggerConfig();
		const configs = await payload.findGlobal({
			slug: 'rebuild'
		}) as TConfig

		const {settings: {token, gitType, link}} = configs

		try {
			if (!user) {
			  throw new Forbidden()
			}
		
			// const request = await triggerBuild({type: gitType, token, link, env})
			// const response = request?.json()

			const request = triggerBuild({type: gitType, token, link, env})
			const resolve = await request
			const { status = 200, statusText, ok } = resolve ?? {}

			const response = request
			.then(res => res?.json())
			.catch(error => {
				if(!ok) {
					throw new Error(error)
				}
				return {}
			})
		
			if (!ok) {
                throw `Server error: [${status}] [${statusText}]`;
            }

			const body = await response
		
			res.status(200).json(body || {})
		  } catch (error: unknown) {
			const message = `An error has occurred in the : '${error}'`
			payload.logger.error(message)
			return res.status(500).json({
			  message,
			})
		  }
	}
}

export default rebuildTriggerEndpoint