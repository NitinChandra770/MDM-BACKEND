const TouringTalkiesPassengerDetails = require('../models/touringTalkiesPassengerDetails');
const moment = require('moment-timezone');

exports.add = (async (req,res)=>{
try{
const newTouringTalkiesPassengerDetails = new TouringTalkiesPassengerDetails(req.body);
await newTouringTalkiesPassengerDetails.save();
res.status(200).send(newTouringTalkiesPassengerDetails);   
}catch(err){
res.status(500).send({error: `error while saving data to touringTalkiesPassengerDetails!`});
console.log('error value is ',err);
}
});

exports.getAll=(async (req,res)=>{
try{
const touringTalkiesPassengerDetails = await TouringTalkiesPassengerDetails.find({});
res.status(200).send(touringTalkiesPassengerDetails);
}catch(err){
res.status(500).send({error: `error while fetching touringTalkiesPassengerDetails!`});
console.log('error value is ',err);
}
});

exports.getByTravelNameAndSelectedDate=(async (req,res)=>{
try{    
const start = moment.tz(req.query.selectedDate, 'YYYY-MM-DD', 'Asia/Kolkata').startOf('day').toDate();
const end = moment.tz(req.query.selectedDate, 'YYYY-MM-DD', 'Asia/Kolkata').endOf('day').toDate();

const touringTalkiesPassengerDetails = await TouringTalkiesPassengerDetails.find({travelName:req.query.travelName,savingDateTime: {
        $gte: start, $lte: end
      }
    });
res.status(200).send(touringTalkiesPassengerDetails);
}catch(err){
res.status(500).send({error: `error while fetching touringTalkiesPassengerDetails!`});
console.log('error value is ',err);
}
});

exports.deleteByTravelName=(async (req,res)=>{
try{
const device = await TouringTalkiesPassengerDetails.deleteMany({travelName: req.query.travelName});
if (device.deletedCount === 0) {
    return res.status(404).send({error: `Device not found!`});  
}
res.status(200).send({message: `Device deleted successfully!`});            
}catch(err){
res.status(500).send({error: `error while deleting device! ${err.message}`});
}
});

