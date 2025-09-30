const express = require('express');
const { getInvoicesByCustomer, AllSellInvoice, invoiceDelete } = require('../controllers/invoiceController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Route to search for invoices by customer name or CNIC
router.get('/search', verifyToken, getInvoicesByCustomer);
router.delete("/deleteInv/:id", verifyToken, invoiceDelete);

router.get('/Allinvoices',verifyToken, AllSellInvoice);
module.exports = router;
