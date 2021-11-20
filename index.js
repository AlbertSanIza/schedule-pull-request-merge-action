const core = require('@actions/core')

const pullRequest = require('./lib/pullRequest.js')
const localeDate = require('./lib/locale.js')
const schedule = require('./lib/schedule.js')

async function run() {
    core.info(`Timezone: ${core.getInput('time_zone')}`)
    core.info(`Started at: ${localeDate(new Date())}`)
    core.info(`GitHub Event Name: ${process.env.GITHUB_EVENT_NAME}`)
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
        core.info('Handle Pull Request Action')
        await pullRequest()
    } else {
        core.info('Handle Schedule Action')
        await schedule()
    }
    core.info(`Ended at: ${localeDate(new Date())}`)
}

run()
