var express = require('express');
var router = express.Router();
var busController = require('../controllers/bus')

router.post('/add', busController.add);
router.get('/getAll',busController.getAll);
router.get('/getByBusServerId',busController.getByBusServerId);
router.get('/getByOperatorId',busController.getByOperatorId);
router.put('/updateByBusServerId', busController.updateByBusServerId); 

module.exports = router;