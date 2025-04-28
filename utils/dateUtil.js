const moment = require('moment-timezone');

function getCurrentDateInIST() {
    return moment().tz('Asia/Kolkata').toDate();
}

module.exports = { getCurrentDateInIST };