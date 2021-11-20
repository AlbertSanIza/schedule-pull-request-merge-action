const core = require('@actions/core')
const github = require('@actions/github')

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
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = schedule
