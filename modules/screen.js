const columnify = require('columnify');

const printHours = (arr, dates, callback) => {
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

    callback(null, arr, dates);
};

const printDateHeader = (data, dates, callback) => {
    console.log('*************************************************');
    console.log(`  From: ${dates.from}            To: ${dates.to} `);
    console.log('*************************************************');

    callback(null, data, dates);
};

module.exports = {
    printHours,
    printDateHeader,
}
