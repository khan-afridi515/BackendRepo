const express = require('express');
const {getAdminProducts, addProduct, getProductById, editProduct, deleteProduct } = require('../controllers/product');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Protected route to add a new product
router.post('/add', verifyToken, addProduct);

//Get Products
router.get('/my-products', verifyToken, getAdminProducts);

// Routes for editing the product 
router.put('/my-product/edit/:id',verifyToken,editProduct)

// Routes for delete the specific product 
router.delete('/my-product/delete/:id',verifyToken,deleteProduct)

// Get Product by ID 
router.get('/:id', verifyToken, getProductById)



module.exports = router;
