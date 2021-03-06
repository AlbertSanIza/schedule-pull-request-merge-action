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
    return pullRequest.head.repo.fork
}

const schedule = async () => {
    try {
        const token = process.env['GITHUB_TOKEN']
        const octokit = github.getOctokit(token)
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')

        core.info(`Loading Open Pull Requests`)

        let pullRequests = await octokit.rest.pulls.list({
            owner,
            repo,
            state: 'open'
        })

        pullRequests = pullRequests.data
            .filter((pullRequest) => {
                if (hasScheduleWithDate(pullRequest.body)) {
                    const dateString = getScheduleDateTime(pullRequest.body)
                    return isValidDate(dateString)
                }
                return false
            })
            .filter((pullRequest) => !isFork(pullRequest))
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

        for await (const pullRequest of duePullRequests) {
            await octokit.rest.pulls.merge({
                owner,
                repo,
                pull_number: pullRequest.number
            })

            core.info(`${pullRequest.html_url} Merged`)

            const checkRuns = await octokit.rest.checks.listForRef({
                owner,
                repo,
                ref: pullRequest.ref
            })

            core.info(`${checkRuns.data.total_count} Check Runs Found`)

            if (checkRuns.data.total_count === 0) {
                continue
            }

            for await (const checkRun of checkRuns.data.check_runs) {
                core.info(`Check Run #${checkRun.id}`)
                await octokit.rest.checks.update({
                    check_run_id: checkRun.id,
                    owner,
                    repo,
                    name: 'Merge Schedule',
                    head_sha: pullRequest.headSha,
                    conclusion: 'success',
                    output: {
                        title: `Scheduled on ${localeDate(new Date(pullRequest.scheduledDate))}`,
                        summary: 'Merged successfully'
                    }
                })
                core.info(`Cleared`)
            }
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = schedule
