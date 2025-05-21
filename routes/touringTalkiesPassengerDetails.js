var express = require('express');
var router = express.Router();
var touringTalkiesPassengerDetails = require('../controllers/touringTalkiesPassengerDetails');

router.post('/add', touringTalkiesPassengerDetails.add);
router.get('/getAll', touringTalkiesPassengerDetails.getAll);
router.get('/getByTravelNameAndSelectedDate', touringTalkiesPassengerDetails.getByTravelNameAndSelectedDate);
router.delete('/deleteByTravelName', touringTalkiesPassengerDetails.deleteByTravelName);






module.exports = router;