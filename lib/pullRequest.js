const core = require('@actions/core')

const pullRequest = async () => {
    console.log(`Started at: ${new Date().toISOString()}`)
    try {
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`)
    } catch (error) {
        core.setFailed(error.message)
    } finally {
        console.log(`Ended at: ${new Date().toISOString()}`)
    }
}

module.exports = pullRequest
