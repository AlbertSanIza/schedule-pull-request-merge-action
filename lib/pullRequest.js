const core = require('@actions/core')
const github = require('@actions/github')

const hasSchedule = (text) => {
    return /(^|\n)\/schedule /.test(text)
}

const getScheduleDateTime = (text) => {
    return text.match(/(^|\n)\/schedule (.*)/).pop()
}

const pullRequest = async () => {
    try {
        const token = process.env['GITHUB_TOKEN']
        const octokit = github.getOctokit(token)

        if (!hasSchedule(github.context.payload.pull_request.body)) {
            core.info(`No /schedule command found`)
            return
        }

        const datestring = getScheduleDateTime(eventPayload.pull_request.body)
        core.info(`Schedule date found: "${datestring}"`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = pullRequest
