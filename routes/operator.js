var express = require('express');
var router = express.Router();
var operatorController = require('../controllers/operator')

router.post('/add', operatorController.add);
router.get('/getAll',operatorController.getAll);
router.get('/getByOperatorId',operatorController.getByOperatorId);
router.put('/updateByOperatorId',operatorController.updateByOperatorId);

module.exports = router;