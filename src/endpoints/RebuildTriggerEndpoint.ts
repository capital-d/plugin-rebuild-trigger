import { PayloadRequest } from 'payload/types'
// import { Response } from 'express'
import { Endpoint } from 'payload/config'
import { GetUrlParams, Git } from '../types';

import { Forbidden } from 'payload/errors'
import { githubEventTrigger } from './githubEventTrigger';
import { giteaEventTrigger } from './giteaEventTrigger';

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

const triggerBuild = async ({type, token, link, env = 'prod'}: {type: Git,token: string, link: string, env: string}) => {
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

const RebuildTriggerEndpoint: Endpoint = {
	path: '/rebuild-static',
	method: 'get', // get will work
	// root: true,
	handler: async (req: PayloadRequest, res) => {

		const {
			payload,
			user,
			query
		  } = req
		const {env} = query
        //get env from qury params to rebuild stage prod

		// const configs = await getRebuildTriggerConfig();
		const configs = await req.payload.findGlobal({
			slug: 'rebuild'
		})

		const {settings: {token, gitType, link}} = configs

		try {
			if (!user) {
			  throw new Forbidden()
			}
		
			const request = await triggerBuild({type: gitType, token, link, env})
			const response = await request?.json()
		
			const { status = 200 } = request ?? {}
		
			res.status(status).json(response)
		  } catch (error: unknown) {
			const message = `An error has occurred in the : '${error}'`
			payload.logger.error(message)
			return res.status(500).json({
			  message,
			})
		  }
	}
}

export default RebuildTriggerEndpoint