const dotenv = require('dotenv');
const nconf = require('nconf');

exports.load = function() {
    // Load any environment variables from .env in the project root directory.
    dotenv.config();

    // Configuration options
    //   1. Command-line arguments
    //   2. Environment variables
    nconf.argv()
        .env();

    return nconf;
}

