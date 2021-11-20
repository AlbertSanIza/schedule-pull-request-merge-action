const core = require('@actions/core')

const pullRequest = require('./lib/pullRequest.js')

async function run() {
    core.info(`Started at: ${new Date().toISOString()}`)
    pullRequest()
    core.info(`Ended at: ${new Date().toISOString()}`)
}

run()
