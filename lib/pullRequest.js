const core = require('@actions/core')
const github = require('@actions/github')

const pullRequest = async () => {
    core.info(`Started at: ${new Date().toISOString()}`)
    try {
        const token = process.env['GITHUB_TOKEN']
        const octokit = github.getOctokit(token)
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`)
    } catch (error) {
        core.setFailed(error.message)
    } finally {
        core.info(`Ended at: ${new Date().toISOString()}`)
    }
}

module.exports = pullRequest
