const core = require('@actions/core')
const github = require('@actions/github')

const hasSchedule = (text) => {
    return /(^|\n)\/schedule /.test(text)
}

const pullRequest = async () => {
    core.info(`Started at: ${new Date().toISOString()}`)
    try {
        const token = process.env['GITHUB_TOKEN']
        const octokit = github.getOctokit(token)

        const firstPayload = JSON.stringify(require(process.env['GITHUB_EVENT_PATH']), undefined, 2)
        console.log(firstPayload)

        console.log('-------------------------------')
        console.log('-------------------------------')
        console.log('-------------------------------')

        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`)

        if (!hasSchedule('')) {
            core.info(`No /schedule command found`)
        }
    } catch (error) {
        core.setFailed(error.message)
    } finally {
        core.info(`Ended at: ${new Date().toISOString()}`)
    }
}

module.exports = pullRequest
