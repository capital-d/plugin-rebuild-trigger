import { PayloadRequest, TypeWithID } from 'payload/types'
// import { Response } from 'express'
import { Endpoint } from 'payload/config'
import { GetUrlParams, Git, RebuildSettings } from '../types';

import { Forbidden } from 'payload/errors'
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

const createRelease = async ({type, token, link, version}: {type: Git,token: string, link: string, version: string})=> {
	if (type === 'github') {
		const repository = getRepositoryPath(link)
		const [owner, repo] = repository.split('/')
		const response = await githubCreateRelease({token, repository, owner, repo, tag: version})
		return response
	}

	if (type === 'custom') {
		throw new Error('Not implemented')
	}
}

const getVersion = async ({type, token, link, env = 'prod'}: {type: Git,token: string, link: string, env: string }) => {
	if (type === 'github') {
		const repository = getRepositoryPath(link)
		const [owner, repo] = repository.split('/')
		const response = await githubLatestRelease({token, repository, env})
		return await response.json()
	}

	if (type === 'custom') {
		// const repository = getRepositoryPath(link)
		// const host = getHost(link)
		// const response = await giteaEventTrigger({host, token, repository, issue: '1', env})
		// return await response.json()
	}
}

const updateVersion = (version: string) => {
	const test = /^v\d+\.\d+\.\d+/.test(version)
	if (!test) {
		throw new Error('Can\'t parse release version')
	}

	const verionArray = version.replace(/v/, '').split('.')

	const bumped = `v${verionArray[0]}.${verionArray[1]}.${+verionArray[2] + 1}`
	return bumped
}

const createReleaseEndpoint: Endpoint = {
	path: '/create-release',
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
		
			const release = await getVersion({type: gitType, token, link, env})

			const version = updateVersion(release.tag_name)

			const createRequest = await createRelease({type: gitType, token, link, version})
			const response = await createRequest?.json()
		
			const { status = 200 } = createRequest ?? {}
		
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

export default createReleaseEndpoint