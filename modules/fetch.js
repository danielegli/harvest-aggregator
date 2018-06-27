// NPM Modules
const fetch = require('node-fetch');
const Headers = require('fetch-headers');
const querystring = require('querystring');

/* Load the rest of the custom modules */
const utilities = require('./utilities.js');
const parser = require('./parser.js');

module.exports = (config) => {
    const module = {};

    /* Setup API Headers */
    const headers = new Headers([
        ['Authorization', `Bearer ${config.get('token')}`],
        ['Harvest-Account-Id', config.get('harvestId')],
        ['User-Agent', config.get('agent')],
    ]);

    // Create query string with date parameters
    const dates = utilities.determineDates(config.get('from'), config.get('to'));
    const qs = querystring.stringify(dates);
 
    // Externally exposed function
    module.get = (callback) => {
        // Perform API call to Harvest for time entries in the given date range
        fetch(`https://api.harvestapp.com/api/v2/time_entries.json?${qs}`, {
            method: 'GET',
            headers: headers,
        })
        .then(res => res.json())
        .then((json) => {
            if (!json.time_entries || json.time_entries.length < 1) {
                callback(new Error(`No time records found for ${dates.from} to ${dates.to}. Ensure that command line date arguement syntax is "YYYY-mm-dd"`));
            } else {
                callback(null, json, dates);
            }
        })
        .catch(err => callback(err));
    }

    return module;
}