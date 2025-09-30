const express = require('express');
const { sellProduct,getProductById, getAdminSellProducts, AllSellProduct, allDelete, searchSale} = require('../controllers/sale');
const { verifyToken } = require('../middleware/auth');
const { verify } = require('jsonwebtoken');
const { get } = require('mongoose');

const router = express.Router();

// Route to sell a product and generate an invoice
router.post('/sell', verifyToken, sellProduct);
router.delete("/sellDlt", verifyToken, allDelete);
router.post("/sellSearch", verifyToken, searchSale);

//Routes to fetch the sell product by id
router.get('/sellproduct/:id', verifyToken,getProductById )
router.get('/getProducts',verifyToken, getAdminSellProducts);
router.get('/wholeProduct',verifyToken, AllSellProduct);
module.exports = router;
