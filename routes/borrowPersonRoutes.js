const express = require('express');
const { addBorrowPerson, getAdminBorrowPersons, getBorrowPersonById, editBorrowPerson, deleteBorrowPerson, searChBorrow } = require('../controllers/borrowPersonController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/cnic_pics/' });

// Route to add a new borrow person
router.post('/add', verifyToken, upload.single('cnicImg'), addBorrowPerson);

// Route to get all borrow persons added by the authenticated admin
router.get('/my-borrow-persons', verifyToken, getAdminBorrowPersons);

router.post('/myborrow/search',verifyToken, searChBorrow)

// Route to get a specific borrow person by ID
router.get('/my-borrow-persons/:id', verifyToken, getBorrowPersonById);

// Route to Edit Borrow Person
router.put('/edit/:id', verifyToken, upload.single('cnicImg'), editBorrowPerson);

// Route to delete the Borrow Person
router.delete('/delete/:id', verifyToken, deleteBorrowPerson);

// Route to get a specific borrow person by ID
router.get('/my-borrow-persons/:id', verifyToken, getBorrowPersonById);

module.exports = router;
