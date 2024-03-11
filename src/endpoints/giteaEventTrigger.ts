export const giteaEventTrigger = async ({host, repository, token, issue = '1', env = 'prod'}: {host: string, repository: string, issue: string, token: string, env?: string}) => {
    console.log(`https://${host}/api/v1/repos/${repository}/issues/${issue}/comments`)
    return await fetch(
        `https://${host}/api/v1/repos/${repository}/issues/${issue}/comments`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `token ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            body: `rebuild_front_${env}`,
          }),
        }
      )
}