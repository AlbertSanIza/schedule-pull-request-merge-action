const core = require('@actions/core')
const github = require('@actions/github')

const localeDate = require('./lib/locale.js')

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

        core.info(`Handling Pull Request Action "${github.context.payload.action}", for ${github.context.payload.pull_request.html_url}`)

        if (!hasScheduleWithDate(github.context.payload.pull_request.body)) {
            core.info(`No "/schedule date" found`)
            return
        }

        const datestring = getScheduleDateTime(github.context.payload.pull_request.body)
        core.info(`/schedule "${datestring}"`)

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
