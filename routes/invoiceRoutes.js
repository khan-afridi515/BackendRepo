const express = require('express');
const { getInvoicesByCustomer } = require('../controllers/invoiceController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Route to search for invoices by customer name or CNIC
router.get('/search', verifyToken, getInvoicesByCustomer);
module.exports = router;
