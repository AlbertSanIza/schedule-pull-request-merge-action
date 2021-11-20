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

const pullRequest = async () => {
    try {
        const token = process.env['GITHUB_TOKEN']
        const octokit = github.getOctokit(token)

        if (!github.context.payload.pull_request) {
            core.info(`Not a Pull Request`)
            return
        }

        if (github.context.payload.pull_request.state !== 'open') {
            core.info(`Pull Request Already Closed`)
            return
        }

        if (github.context.payload.pull_request.head.repo.fork) {
            core.setFailed(`This Action is Not Allowed in Forks`)
            return
        }

        core.info(`Handling Pull Request Action "${github.context.payload.action}", for ${github.context.payload.pull_request.html_url}`)

        if (!hasScheduleWithDate(github.context.payload.pull_request.body)) {
            core.info(`No "/schedule date" found`)
            return
        }

        const dateString = getScheduleDateTime(github.context.payload.pull_request.body)
        core.info(`/schedule ${dateString}`)

        if (!isValidDate(dateString)) {
            core.info(`"${dateString}" is not a Valid Date`)
            return
        }

        const scheduledDate = localeDate(new Date(dateString))

        core.info(`/schedule ${scheduledDate} on ${core.getInput('time_zone')} Timezone`)

        if (scheduledDate < localeDate(new Date())) {
            core.info(`Scheduled Date is in the past`)
            return
        }

        const { data } = await octokit.rest.checks.create({
            owner: github.context.payload.repository.owner.login,
            repo: github.context.payload.repository.name,
            name: 'Merge Schedule',
            head_sha: github.context.payload.pull_request.head.sha,
            status: 'in_progress',
            output: {
                title: `Scheduled to be Merged`,
                summary: `Date: ${scheduledDate}`
            }
        })

        core.info(`Check Run Created: ${data.html_url}`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = pullRequest
