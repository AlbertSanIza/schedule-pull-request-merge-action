const core = require('@actions/core')

const pullRequest = require('./lib/pullRequest')

async function run() {
    pullRequest()
}

run()
