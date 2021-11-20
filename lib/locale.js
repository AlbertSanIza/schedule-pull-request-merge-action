const core = require('@actions/core')

const localeDate = (date) => {
    return new Date(date.toLocaleString('en-US', { timeZone: core.getInput('time_zone') }))
}

module.exports = localeDate
