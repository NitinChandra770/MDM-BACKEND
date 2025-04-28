const Operator = require('../models/operator');
const moment = require('moment-timezone');

exports.add = (async (req,res)=>{
const operatorData = { ...req.body};

try {
    let existingOperator = await Operator.findOne({ operatorId: req.body.operatorId });

    if (existingOperator) {
        // Update all fields with new values 
        Object.assign(existingOperator, operatorData);
        await existingOperator.save();
        return res.status(200).send(existingOperator);
    }
    const newOperator = new Operator(operatorData);
    await newOperator.save();
    res.status(200).send(newOperator);   
}catch(err){
res.status(500).send({error: `error while saving data to operator!`});
console.log('error value is ',err);
}
});

exports.getAll=(async (req,res)=>{
var operatorDetails = new Operator();    
try{
    operatorDetails = await Operator.find();
    res.status(200).send(operatorDetails);
}catch(err){
 res.status(500).send({err: 'Error occured while getting all operator details in operator table '+err.message});
}
});

exports.getByOperatorId=(async (req,res)=>{
    var operatorDetails = new Operator();
    try{
    operatorDetails = await Operator.findOne({operatorId:req.query.operatorId});
    res.status(200).send(operatorDetails);
    }catch(err){
        res.status(500).send({err: 'Error occured while getting all operator details in operator table '+err.message});
    }
    });

    exports.updateByOperatorId=(async(req,res)=>{
        try{
            const operator = await Operator.findOneAndUpdate({operatorId:req.query.operatorId},{
                $set:
                {...req.body,
                 modifiedDateTime:istDate
                }
            },
            { new: true}
            );
            if(!operator){
                return res.status(400).send({error:`no data with operatorId ${req.query.operatorId} found!`});
            }
            res.status(200).send(operator);
        }catch(err){
            res.status(500).send({error: `error occured while updating operator details of operator ${req.query.operatorId}`})
        }
    });