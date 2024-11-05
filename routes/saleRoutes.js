const express = require('express');
const { sellProduct,getProductById} = require('../controllers/sale');
const { verifyToken } = require('../middleware/auth');
const { verify } = require('jsonwebtoken');

const router = express.Router();

// Route to sell a product and generate an invoice
router.post('/sell', verifyToken, sellProduct);

//Routes to fetch the sell product by id
router.get('/sellproduct/:id', verifyToken,getProductById )


module.exports = router;
