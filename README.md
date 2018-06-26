# Harvest Time Entry Aggregator

This application will pull time entry records from Harvest and aggregate the types of hours to validate paystubs.

## Features

* Automatic last pay period calculations (no parameters)
* Detect week days with no hours

## Definitions

* Overtime = Any hours over 7.5 on a weekday or any hours on a weekend
* Stat = Hours recorded against the stat task
* Holiday = Hours recorded against the holiday task

## Setting up the App

* Install NodeJS
* Configure the .ENV file for your Harvest account information and place it in the root directory.  A sample .env is provided in the 'sample' folder.


## Running the App

You know the drill, clone the repo, install dependancies and run index.js

```
    git clone https://github.com/danielegli/harvest-aggregator.git
    cd harvest-aggregator
    npm install
    node index.js
```

## Arguments

The application does take a few command line flags

* --to='YYYY-mm-dd': Is used as the start date for the aggregation. If no parameter is provided, the first day of the last pay period is used
* --from='YYYY-mm-dd': Is used as the finish date for the aggregation. If no parameter is provided, the last day of the last pay period is used