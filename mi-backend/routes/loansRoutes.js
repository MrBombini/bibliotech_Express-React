const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.get('/', loanController.getAll);
router.post('/', loanController.create);

module.exports = router;
