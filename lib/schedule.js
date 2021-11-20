const core = require('@actions/core')
const github = require('@actions/github')

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
