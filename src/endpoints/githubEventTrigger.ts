export const githubEventTrigger = async ({repository, token, env = 'prod'}: {repository: string, token: string, env?: string}) => {
    return await fetch(
        `https://api.github.com/repos/${repository}/dispatches`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.github.everest-preview+json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            event_type: `rebuild_static_${env}`,
          }),
        }
      )
}