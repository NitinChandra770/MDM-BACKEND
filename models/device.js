const mongoose = require('mongoose')
const { getCurrentDateInIST } = require('../utils/dateUtil')
var schema = mongoose.mongoose.Schema;

var deviceTable = new schema({
    androidId : {type: String, required: true}, //to set from backend
    deviceVersion : {type: String, default:""}, //to set from backend
    device_model : {type: String, default:""}, //to set from backend
    notificationId:{type: String, default:""}, //to send from frontend
    busServerId : {type: String, required: true}, //to set from backend
    ipAddress: {type: String, required: true}, //to set from backend
    seatNumber : {type: String, default:""}, //to set from frontend
    deviceStatus : {type:Boolean, default:false},
    deviceLocation : {type:String, default:""},
    lastDeviceOnDateTime : {type:Number, default:0},
    savingDateTime : Date, //to set from system
    modifiedDateTime : Date //to set from system
});

deviceTable.pre('save', function(next){
const istDate = getCurrentDateInIST();

if(this.isNew){
    this.savingDateTime = istDate;
    console.log('this.savingDateTime is ',this.savingDateTime);
    }else
    {
        this.modifiedDateTime = istDate; 
        console.log('this.modifiedDateTime is ',this.modifiedDateTime);
    }
    next();
});

module.exports = mongoose.model('device',deviceTable);