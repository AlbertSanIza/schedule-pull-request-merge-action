const core = require('@actions/core')
const github = require('@actions/github')

const pullRequest = async () => {
    console.log(`Started at: ${new Date().toISOString()}`)
    try {
        const myToken = core.getInput('myToken')
        const octokit = github.getOctokit(myToken)
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = pullRequest
