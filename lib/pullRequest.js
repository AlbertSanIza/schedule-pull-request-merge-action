const core = require('@actions/core')
const github = require('@actions/github')

const hasSchedule = (text) => {
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

        console.log(JSON.stringify(github.context.payload, null, 2))

        if (!github.context.payload.pull_request) {
            core.info(`Not a Pull Request`)
            return
        }

        core.info(`Handling Pull Request action "${github.context.payload.action}", for ${github.context.payload.pull_request.html_url}`)

        if (!hasSchedule(github.context.payload.pull_request.body)) {
            core.info(`No /schedule command found`)
            return
        }

        const datestring = getScheduleDateTime(eventPayload.pull_request.body)
        core.info(`Schedule date found: "${datestring}"`)

        if (!isValidDate(datestring)) {
            core.info(`"${datestring}" is not a Valid Date`)
            return
        }

        core.info(`We can proceed!`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = pullRequest
