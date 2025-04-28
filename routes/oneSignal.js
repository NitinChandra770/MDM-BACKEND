var express = require('express');
var router = express.Router();
const oneSignalController = require ('../controllers/oneSignal')

/* GET users listing. */
router.get('/getSubscribersByRole',oneSignalController.getSubscribersByRole);
router.get('/getActiveSubscribersByRoleAndSyncDeviceDB',oneSignalController.getActiveSubscribersByRoleAndSyncDeviceDB);
router.get('/sendTestNotification',oneSignalController.sendTestNotification);
router.get('/getDevicesActive',oneSignalController.getDevicesActive);


module.exports = router;
