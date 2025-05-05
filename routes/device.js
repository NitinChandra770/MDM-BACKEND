var express = require('express');
var router = express.Router();
var deviceController = require('../controllers/device')

router.post('/add', deviceController.add);
router.get('/getAll', deviceController.getAll);
router.get('/getByAndroidId', deviceController.getByAndroidId);
router.get('/getByBusServerId', deviceController.getByBusServerId);
router.delete('/deleteByAndroidId', deviceController.deleteByAndroidId);
router.delete('/deleteByBusServerId', deviceController.deleteByBusServerId);
router.put('/updateByAndroidId', deviceController.updateByAndroidId);
router.put('/updateByBusServerId', deviceController.updateByBusServerId); 
router.put('/updateBulkDeviceByBusServerId', deviceController.updateBulkDeviceByBusServerId);
router.put('/updateBulkDeviceByAndroidId', deviceController.updateBulkDeviceByAndroidId);

module.exports = router;