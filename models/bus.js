const mongoose = require('mongoose')
const { getCurrentDateInIST } = require('../utils/dateUtil');
var schema = mongoose.mongoose.Schema;

var busTable = new schema({
    busId : {type: Number },
    name : {type: String},
    operatorId : {type: Number },
    source : {type: String},
    destination : {type: String},
    routeName : {type: String},
    busAppStatus:{type: String},
    busServerId:{type: String},
    password:{type: String},
    macIdForDevice:{type: String, default:""},
    macIdForTablet:{type: String},
    OTPValidate: {type: String}, //to send from frontend
    type : {type: String},
    make : {type: String},
    status: {type: Boolean},
    noofseat:{type: Number },
    AuthenticateCount:{type: Number , default:0},
    busConfig:{type: String, default:"{}"},
    OTPMovie:{type: String, default:"123456"},
    OTPAuthenticate:{type: String, default:"123456"},
    lastPassword:{type: String},
    routes:{type: String},
    session:{type: Date},
    cities:{type: String, default:"[]"},
    viaCities:{type: String, default:"{}"},
    otpValidity:{type: Boolean, default:false},
    chassisNo:{type: String, default:""},
    location_id:{type: String},
    savingDateTime : Date,
    modifiedDateTime : Date 
});

busTable.pre('save', function (next) {
    const istDate = getCurrentDateInIST();

    if (this.isNew) {
        this.savingDateTime = istDate;
    }
    else{
    this.modifiedDateTime = istDate;
    }
    next();
});

module.exports = mongoose.model('bus', busTable);