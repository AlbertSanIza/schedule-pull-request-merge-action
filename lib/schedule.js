const core = require('@actions/core')
const github = require('@actions/github')

const localeDate = require('./locale.js')

const hasScheduleWithDate = (text) => {
    return /(^|\n)\/schedule /.test(text)
}

const getScheduleDateTime = (text) => {
    return text.match(/(^|\n)\/schedule (.*)/).pop()
}

const isValidDate = (text) => {
    const date = new Date(text)
    return date instanceof Date && !isNaN(date)
}

const isFork = (pullRequest) => {
    return !!pullRequest.head.repo.fork
}

const schedule = async () => {
    try {
        const token = process.env['GITHUB_TOKEN']
        const octokit = github.getOctokit(token)

        core.info(`Loading Open Pull Requests`)

        const pullRequests = await octokit.rest.paginate(
            'GET /repos/:owner/:repo/pulls',
            {
                owner: github.context.payload.repository.owner.login,
                repo: github.context.payload.repository.name,
                state: 'open'
            },
            (response) => {
                return response.data
                    .filter((pullRequest) => {
                        if (hasScheduleWithDate(pullRequest.body)) {
                            const dateString = getScheduleDateTime(pullRequest.body)
                            return isValidDate(dateString)
                        }
                        return false
                    })
                    .filter((pullRequest) => isFork(pullRequest))
                    .map((pullRequest) => {
                        const dateString = getScheduleDateTime(pullRequest.body)
                        return {
                            scheduledDate: dateString,
                            ref: pullRequest.head.sha,
                            number: pullRequest.number,
                            headSha: pullRequest.head.sha,
                            html_url: pullRequest.html_url
                        }
                    })
            }
        )

        if (pullRequests.length === 0) {
            core.info('No Scheduled Pull Requests Found')
            return
        }

        core.info(`${pullRequests.length} Scheduled Pull Requests Found:`)
        pullRequests.forEach((pullRequest) => {
            core.info(`Pull Request #${pullRequest.number}`)
            core.info(`Scheduled Date: ${localeDate(new Date(pullRequest.scheduledDate))}`)
        })

        const duePullRequests = pullRequests.filter((pullRequest) => {
            return localeDate(new Date(pullRequest.scheduledDate)) < localeDate(new Date())
        })

        if (duePullRequests.length === 0) {
            core.info('No Scheduled Pull Requests are Due at this Moment')
            return
        }

        core.info(`${duePullRequests.length} Pull Requests are Due:`)
        pullRequests.forEach((pullRequest) => {
            core.info(`Pull Request #${pullRequest.number}`)
            core.info(`Scheduled Date: ${localeDate(new Date(pullRequest.scheduledDate))}`)
        })
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = schedule
