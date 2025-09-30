const express = require('express');
const { expenses } = require('../controllers/shopExpense');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/addExpenses',verifyToken, expenses);

module.exports=router;