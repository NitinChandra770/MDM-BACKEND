const mongoose = require('mongoose')
const { getCurrentDateInIST, formatDeviceDatesToIST } = require('../utils/dateUtil')
var schema = mongoose.mongoose.Schema;

var touringTalkiesPassengerDetailsTable = new schema({
    location_id : {type: String}, 
    network_id : {type: String}, 
    session_id : {type: String}, 
    login_app_id:{type: String}, 
    user_id : {type: String}, 
    bandwidth: {type: String}, 
    first_name : {type: String}, 
    last_name : {type: String},
    email : {type:String},
    phoneNumber : {type:String},
    busServerId : {type: String},
    travelName:{type: String},
    savingDateTime : Date, 
    modifiedDateTime : Date
});

touringTalkiesPassengerDetailsTable.pre('save', function(next){
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

touringTalkiesPassengerDetailsTable.set('toJSON', {
    transform: function (doc, ret) {
        return formatDeviceDatesToIST(ret);
    }
});


module.exports = mongoose.model('touringTalkiesPassengerDetails',touringTalkiesPassengerDetailsTable);