const columnify = require('columnify');

const determineDates = (from, to) => {
    if (from && to) {
        return {
            from,
            to
        }
    }
    // If currently in the first half of the month
    if (new Date().getDate() <= 15) {
        return {
            from: `${new Date().getFullYear()}-${new Date().getMonth()}-16`,
            to: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
        };
    }
    // If currently in the second half of the month
    return {
        from: `${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1).toString()).slice(-2)}-01`,
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
    };
};

const sortObjectKeys = (obj) => {
    return Object.keys(obj).sort().reduce((acc, key) => {
        if (Array.isArray(obj[key])) {
            acc[key] = obj[key].map(sortObjectKeys);
        }
        if (typeof obj[key] === 'object') {
            acc[key] = sortObjectKeys(obj[key]);
        }
        else {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
};

const consolePrint = (arr) => {
    console.log(columnify(
        arr,
        {
            minWidth: 18,
            // paddingChr: '.',
            columns: ['Type', 'Hours'],
            config: {
                Hours: { align: 'right' },
            },
        }
    ));
};

const consoleDates = (dates) => {
    console.log('*************************************************');
    console.log(`  From: ${dates.from}            To: ${dates.to} `);
    console.log('*************************************************');
};

const stringToDate = (str) => {
    // str format should be yyyy-mm-dd. 
    const year = parseInt(str.split('-')[0]);
    const mon = parseInt(str.split('-')[1]);
    const day = parseInt(str.split('-')[2]);
    const date = new Date(year, mon - 1, day);
    return date;
};

const dateToString = (date) => {
    return '' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
};

return module.exports = {
    determineDates,
    sortObjectKeys,
    consolePrint,
    consoleDates,
    stringToDate,
    dateToString,
}