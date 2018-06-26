const utilities = require('../modules/utilities');

// Function to aggregate time entries for reporting
const aggregateHours = (json) => {
    //  Final array holding all aggregate data
    const data = [];

    data.push(...aggregateRegularOvertime(json));
    data.push(aggregateStats(json));
    data.push(aggregateVacation(json));
    data.push([]);
    data.push(...aggregateProjects(json));

    return data;    
}

const aggregateProjects = (json) => {
    const map = new Map();

    // Loop through the time entries and aggregate by project
    json.time_entries.forEach((n) => {
        // If map doesn't have that key yet, set hours, otherwise increment hours
        map.set(n.project.name, (!map.has(n.project.name) ? n.hours : map.get(n.project.name) + n.hours));
    });
    
    const data = [];

    // Loop over map and create aggregate objects to return
    for (var [key, value] of map.entries()) {
        data.push({
            Type: key,
            Hours: value,
        });
    }
    return data;
};

const aggregateRegularOvertime = (json) => {
    // Aggregate days into this map variable
    let map = new Map();

    // Filter out stats and vacation (mispelt on purpose to match)
    let data = json.time_entries.filter(n => n.task.name !== 'Stat holdiay' && n.task.name !== 'Vacation');

    /* acc = accumulated map
       cur = current array value */
    data
        .reduce((acc, cur) => {
            // If the map doesn't contain the date, create a new map item with zero hours
            if (!acc.has(cur.spent_date)) {
                acc.set(cur.spent_date, 0);
            }
            // Increment the mapped date by the current hours            
            acc.set(cur.spent_date, acc.get(cur.spent_date) + cur.hours);
            return acc;
        }, map);

    // Calculate overtime as hours over 7.5
    let overtime = 0;
    let regular = 0;
    for (var [key, value] of map.entries()) {
        const dayOfWeek = utilities.stringToDate(key).getDay();

        // For weekdays, calculate 7.5 hours of regular hours first
        if (dayOfWeek > 0 && dayOfWeek < 6) {
            overtime += Math.max(value - 7.5, 0);
            regular += Math.min(value, 7.5);
        } else {
            // All hours on weekends are overtime
            overtime += Math.max(value - 7.5, 0);
        }
    }
    return [{
            Type: 'Regular Hours',
            Hours: regular,
        }, 
        {
            Type: 'Total OT',
            Hours: overtime,
        }];
};

const aggregateStats = (data) => {
    // Filter data for just vacation days
    const stats = data.time_entries.filter(n => {
        return n.task.name == 'Stat holdiay';
    });

    // Sum up vacation hours
    const statHours = stats.reduce((acc, cur) => {
        acc += cur.hours;
        return acc;
    }, 0);

    return {
        Type: 'Stats',
        Hours: statHours,
    };
};

const aggregateVacation = (data) => {
    // Filter data for just vacation days
    const vacation = data.time_entries.filter(n => {
        return n.task.name == 'Vacation';
    });
    
    // Sum up vacation hours
    const vacationHours = vacation.reduce((acc, cur) => {
        acc += cur.hours;
        return acc;
    }, 0);

    return {
        Type: 'Vacation',
        Hours: vacationHours,
    };
};

const detectMissingDays = (dates, data) => {    
    // Aggregate days into this map variable
    let map = new Map();

    /* acc = accumulated map
       cur = current array value */
    data.time_entries
        .reduce((acc, cur) => {
            // If the map doesn't contain the date, create a new map item with zero hours
            if (!acc.has(cur.spent_date)) {
                acc.set(cur.spent_date, 0);
            }
            // Increment the mapped date by the current hours            
            acc.set(cur.spent_date, acc.get(cur.spent_date) + cur.hours);
            return acc;
        }, map);
            
    let loop = utilities.stringToDate(dates.from);
    while (loop <= utilities.stringToDate(dates.to)) {
        // Check if it's a weekday
        if (loop.getDay() > 0 && loop.getDay() < 6) {
            const loopStr = utilities.dateToString(loop);

            // Check if there is time for this day
            if (!map.has(loopStr) || map.get(loopStr) < 7.5) {
                console.log(`\nWARNING: ${loopStr} is a ${loop.toLocaleString('en-us', { weekday: 'long' })} with less than 7.5 hours recorded.\n`);
            }            
        }

        // Increment looping date by one day
        loop.setDate(loop.getDate() + 1);
    }
}

module.exports = {
    aggregateHours,
    detectMissingDays,
};