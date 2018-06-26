/*  
    Author: Daniel Egli
    Description: Time entry double check for ensuring paystubs are correct
    Instructions:
        1. Replace .env variables with Harvest options
        2a. Call with no parameters to automatically calculate last paystub
        2b. Call with --from and --to parameters for manual time range

    TODO: 
        - Calculate weekdays and check for days with no hours
        - Calculate OT by 40+ hours
*/

// NPM Modules
const fetch = require('node-fetch');
const Headers = require('fetch-headers');
const querystring = require('querystring');

// Custom Modules
const config = require('./modules/config.js');
const utilities = require('./modules/utilities.js');
const parser = require('./modules/parser.js');

/* Setup Configurations */
const appConfig = config.load();

/* Setup API Headers */
const headers = new Headers([
    ['Authorization', `Bearer ${appConfig.get('token')}`],
    ['Harvest-Account-Id', appConfig.get('harvestId')],
    ['User-Agent', appConfig.get('agent')],
]);

// Create query string with date parameters
const dates = utilities.determineDates(appConfig.get('from'), appConfig.get('to'));
const qs = querystring.stringify(dates);

// Perform API call to Harvest for time entries in the given date range
fetch(`https://api.harvestapp.com/api/v2/time_entries.json?${qs}`, {
    method: 'GET',
    headers: headers,
})
    .then(res => res.json())
    .then(json => success(json))
    .catch(err => console.error(err));

// Aggregate time entries and print to console
const success = (data) => {
    if (!data.time_entries || data.time_entries.length < 1) {
        console.log(`ERROR: No time records found for ${dates.from} to ${dates.to}`);
        console.log('Ensure that command line date syntax is "YYYY-mm-dd"');
    } else {
        // Create header
        utilities.consoleDates(dates);

        // Look for missing time entries
        parser.detectMissingDays(dates, data);
        
        // Aggregate and print to screen
        utilities.consolePrint(parser.aggregateHours(data));
    }    
}