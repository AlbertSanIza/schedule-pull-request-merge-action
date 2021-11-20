const core = require('@actions/core')

const pullRequest = require('./lib/pullRequest.js')
const localeDate = require('./lib/locale.js')

async function run() {
    core.info(`Timezone: ${core.getInput('time_zone')}`)
    core.info(`Started at: ${localeDate(new Date())}`)
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
        pullRequest()
    } else {
        core.info(`Should attempt merge`)
    }
    core.info(`Ended at: ${localeDate(new Date())}`)
}

run()
