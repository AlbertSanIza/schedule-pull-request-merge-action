const core = require('@actions/core')

const pullRequest = require('./lib/pullRequest')

async function run() {
    pullRequest()
}

run()

process.on('unhandledRejection', (reason, promise) => {
    core.warning('Unhandled Rejection at:')
    core.warning(promise)
    core.setFailed(reason)
})
