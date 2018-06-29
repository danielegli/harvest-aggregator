/*  
    Author: Daniel Egli
    Description: Time entry double check for ensuring paystubs are correct
    Instructions:
        1. Replace .env variables with Harvest options
        2a. Call with no parameters to automatically calculate last paystub
        2b. Call with --from and --to parameters for manual time range
*/

/* 3rd Party Modules */
const async = require('async');

/* Custom Config Module (need to initalize before other modules) */
const config = require('./modules/config.js');

/* Setup Configurations */
const appConfig = config.load();

/* Custom Modules */
const bot = require('./modules/bot')(appConfig);
const fetch = require('./modules/fetch')(appConfig);
const parser = require('./modules/parser');
const screen = require('./modules/screen');

/* Check if running Slackbot or standalone
   If the bot flag has been passed, start up the Slack bot after this */
if (appConfig.get('bot')) {
    bot.run();
} else {
    async.waterfall([
        fetch.get,
        parser.aggregateHours,
        screen.printDateHeader,
        screen.printHours,
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
}
