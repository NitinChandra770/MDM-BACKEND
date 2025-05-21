const Device = require('../models/device');
const { getCurrentDateInIST } = require('../utils/dateUtil');


exports.add = (async (req,res)=>{
try{
const exisitngBusServerId = await Device.findOne({busServerId:req.body.busServerId});
if(!exisitngBusServerId){
  return res.status(404).send({message: `busServerId ${req.body.busServerId} not exist!`});
}
const exisitngDevice = await Device.findOne({androidId:req.body.androidId});
if(exisitngDevice){
Object.assign(exisitngDevice,req.body);
await exisitngDevice.save();
return res.status(200).send(exisitngDevice);
} 
const newdevice = new Device(req.body);
await newdevice.save();
res.status(200).send(newdevice);   
}catch(err){
res.status(500).send({error: `error while saving data to device!`});
console.log('error value is ',err);
}
});

exports.getAll=(async (req,res)=>{
try{
const devices = await Device.find({});
res.status(200).send(devices);
}catch(err){
res.status(500).send({error: `error while fetching devices!`});
console.log('error value is ',err);
}
});

exports.getByAndroidId=(async (req,res)=>{
try{
const device = await Device.findOne({androidId: req.query.androidId});
if (!device) {
    return res.status(404).send({error: `Device not found!`});
}
res.status(200).send(device);
}catch(err){
res.status(500).send({error: `error while fetching devices! ${err.message}`});       
}         
});

exports.getByBusServerId=(async (req,res)=>{
try{
const devices = await Device.find({busServerId: req.query.busServerId});
if (devices.length === 0){
    return res.status(404).send({error: `Device not found!`});
}
res.status(200).send(devices);
}catch(err){
res.status(500).send({error: `error while fetching devices! ${err.message}`});
}       
});

exports.deleteByAndroidId=(async (req,res)=>{
try{   
const device = await Device.findOneAndDelete({androidId: req.query.androidId});
if (!device) {
    return res.status(404).send({error: `Device not found!`});
}
res.status(200).send({message: `Device deleted successfully!`});
}catch(err){   
res.status(500).send({error: `error while deleting device! ${err.message}`});
}
});

exports.deleteByBusServerId=(async (req,res)=>{
try{
const device = await Device.deleteMany({busServerId: req.query.busServerId});
if (device.deletedCount > 0) {
    return res.status(404).send({error: `Device not found!`});  
}
res.status(200).send({message: `Device deleted successfully!`});            
}catch(err){
res.status(500).send({error: `error while deleting device! ${err.message}`});
}
});

exports.updateByAndroidId=(async (req,res)=>{
    try{
        const istDate = getCurrentDateInIST();
        const device = await Device.findOneAndUpdate({androidId: req.query.androidId}, {
            $set: {
              ...req.body,
              modifiedDateTime: istDate
            }
          }, {new: true});
        if (!device) {
            return res.status(404).send({error: `Device not found!`});
        }
        res.status(200).send(device);
    }catch(err){
        res.status(500).send({error: `error while updating device! ${err.message}`});
    }
});

exports.updateByBusServerId=(async (req,res)=>{
    try{
         const istDate = getCurrentDateInIST();
        const device = await Device.findOneAndUpdate({busServerId: req.query.busServerId}, {
            $set: {
              ...req.body,
              modifiedDateTime: istDate
            }
          }, {new: true});
        if (!device) {
            return res.status(404).send({error: `Device not found!`});
        }
        res.status(200).send(device);
    }catch(err){
        res.status(500).send({error: `error while updating device! ${err.message}`});
    } 
});

exports.updateBulkDeviceByBusServerId=(async (req,res)=>{
try{
    const updates = req.body.deviceUpdateData;
     const istDate = getCurrentDateInIST();

    if (!Array.isArray(updates)) {
        return res.status(400).send({ error: "deviceUpdateData must be an array..." });
      }

      const updateResults = [];

      for(const data of updates){
        const {busServerId, ...updateFields} = data;

        if(!busServerId){
            updateResults.push({error:`Missing BusServerId ${data}`});
            continue;
        }

        var result = await Device.findOneAndUpdate({busServerId},{$set: updateFields, modifiedDateTime: istDate},{new:true});
        if (!result) {
            result={error: `Device not found with busServerId ${busServerId}!`};
        }
        updateResults.push(result);      
      }
      res.status(200).send({ message: "Devices updated successfully", data: updateResults });

}catch(err){
    res.status(500).send({error: "an error occured while bulk device update! "+err.message});
}
});

exports.updateBulkDeviceByAndroidId = (async (req,res)=>{
    try{
        const updates = req.body.deviceUpdateData;
        const istDate = getCurrentDateInIST();
        if(!Array.isArray(updates)){
            return res.status(400).send({err: 'deviceUpdateData must be an array!'});
        }
        const updateResults = [];
        
        for(const data of updates){
            const {androidId, ...updateFields} = data;

            if(!androidId){
            updateResults.push({error:`Missing AndroidId ${data}`});
            continue;
        }

            var result = await Device.findOneAndUpdate({androidId:androidId},{$set: updateFields, modifiedDateTime:istDate}, {new:true});
            if(!result){
                result = {error: `Device not found with AndroidId ${androidId}!`};
            }
            updateResults.push(result);
        }
        res.status(200).send({ message: "Devices updated successfully", data: updateResults });
    }catch(err){
        res.status(500).send({error: "an error occured while bulk device update! "+err.message});
    }
});




