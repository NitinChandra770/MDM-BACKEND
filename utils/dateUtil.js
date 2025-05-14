const moment = require('moment-timezone');

function getCurrentDateInIST() {
    return moment().tz('Asia/Kolkata').toDate();
}

function formatDeviceDatesToIST(obj) {
        if (obj.modifiedDateTime) {
            obj.modifiedDateTime = moment(obj.modifiedDateTime).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss');
        }
        if (obj.savingDateTime) {
            obj.savingDateTime = moment(obj.savingDateTime).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss');
        }
        return obj;
}

module.exports = { getCurrentDateInIST, formatDeviceDatesToIST };