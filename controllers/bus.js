const Bus = require('../models/bus');
const { getCurrentDateInIST } = require('../utils/dateUtil');

exports.add = (async (req,res)=>{
const busData = { ...req.body};

try {
    let existingBus = await Bus.findOne({ busId: req.body.busId });

    if (existingBus) {
        // Update all fields with new values 
        Object.assign(existingBus, busData);
        await existingBus.save();
        return res.status(200).send(existingBus);
    }
    const newBus = new Bus(busData);
    await newBus.save();
    res.status(200).send(newBus);   
}catch(err){
res.status(500).send({error: `error while saving data to bus!`});
console.log('error value is ',err);
}
});

exports.getAll=(async (req,res)=>{
var busDetails = new Bus();    
try{
busDetails = await Bus.find();
res.status(200).send(busDetails);
}catch(err){
 res.status(500).send({err: 'Error occured while getting all bus details in bus table '+err.message});
}
});

exports.getByBusServerId=(async (req,res)=>{
    var busDetails = new Bus();
    try{
    busDetails = await Bus.findOne({busServerId:req.query.busServerId});
    res.status(200).send(busDetails);
    }catch(err){
        res.status(500).send({err: 'Error occured while getting all bus details in bus table '+err.message});
    }
    });

    exports.getByOperatorId=(async (req,res)=>{
        var busDetails = new Bus();
        try{
        busDetails = await Bus.find({operatorId:req.query.operatorId});
        if (busDetails.length === 0) {
            return res.status(404).send({error: 'Bus not found with the given operatorId'});
        }
        res.status(200).send(busDetails);
        }catch(err){
            res.status(500).send({err: 'Error occured while getting all bus details in bus table '+err.message});
        }
        });

        exports.updateByBusServerId = (async (req,res)=>{
        try{
           const istDate = getCurrentDateInIST();
           const bus = await Bus.findOneAndUpdate({busServerId: req.query.busServerId},{
            $set:
            {...req.body,
             modifiedDateTime:istDate
            }
        },
        { new: true}
        );
        if(!bus){
            return res.status(404).send({error: `no data with busServerId ${req.query.busServerId} found!`});
        } 
        res.status(200).send(bus);
        }catch(err){
           res.status(500).send({err: `error occured while updating bus with busServerId ${req.query.busServerId} ${err.message}`}); 
        }
        });
