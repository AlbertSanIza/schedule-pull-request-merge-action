const core = require('@actions/core')

const pullRequest = require('./lib/pullRequest.js')
const localeDate = require('./lib/locale.js')

async function run() {
    core.info(`Started at: ${localeDate(new Date())}`)
    pullRequest()
    core.info(`Ended at: ${localeDate(new Date())}`)
}

run()
