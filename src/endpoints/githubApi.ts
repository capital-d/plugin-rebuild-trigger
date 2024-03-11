export const eventTrigger = async ({repository, token, env = 'prod'}: {repository: string, token: string, env?: string}) => {
    return await fetch(
        `https://api.github.com/repos/${repository}/dispatches`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.github.everest-preview+json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            event_type: `rebuild_front_${env}`,
          }),
        }
      )
}

export const createRelease = async ({repository, token, owner, repo, tag}: {repository: string, token: string, owner: string, repo: string, tag: string}) => {
    return await fetch(
        `https://api.github.com/repos/${repository}/releases`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.github.everest-preview+json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            owner: owner,
            repo: repo,
            tag_name: tag,
            target_commitish: 'master',
            name: tag,
            body: `Description of the release ${tag}`,
            draft: false,
            prerelease: false,
            generate_release_notes: false,
          }),
        }
      )
}

export const getLetestRelease = async ({repository, token, env = 'prod'}: {repository: string, token: string, env?: string}) => {
    return await fetch(
        `https://api.github.com/repos/${repository}/releases/latest`,
        {
          method: "GET",
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            Accept: "application/vnd.github.everest-preview+json",
            Authorization: `token ${token}`,
          },
        }
      )
}