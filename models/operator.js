const mongoose = require('mongoose')
const { getCurrentDateInIST } = require('../utils/dateUtil');
var schema = mongoose.mongoose.Schema;

var operatorTable = new schema({
    operatorId : {type: Number },
    name : {type: String},
    type : {type: Number },
    emailId : {type: String},
    emailIdForHotelBooking : {type: String},
    emailIdForCabBooking : {type: String},
    emailIdForTicketRequest : {type: String},
    emailIdForComplaint:{type: String},
    emailIdForCustomerFeedBack:{type: String},
    emailIdForInstallation:{type: String},
    operatorLogo:{type: String},
    POCname:{type: String},
    POCnumber: {type: String}, //to send from frontend
    status: {type: Boolean},
    operatorAmazonId:{type: Number },
    emailService:{type: Boolean , default:false},
    maExpiryDate:{type: String},
    maSessionDuration:{type: Number, default:60},
    maConfig:{type: String, default:"{}"},
    otp:{type: String,default:"1212"},
    cities:{type: String,default:"[]"},
    notificationFlag:{type: Boolean, default:false},
    savingDateTime : Date,
    modifiedDateTime : Date 
});

operatorTable.pre('save', function (next) {
    const istDate = getCurrentDateInIST();

    if (this.isNew) {
        this.savingDateTime = istDate;
    }
    else{
    this.modifiedDateTime = istDate;
    }
    next();
});

module.exports = mongoose.model('operator', operatorTable);