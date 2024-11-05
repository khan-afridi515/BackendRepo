const express = require('express');
const { addEmployee, getAdminEmployees, getEmployeeById, getEmployeesByName, deleteEmployee, editEmployee } = require('../controllers/employees');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads (store files in 'uploads/cnic_pics' directory)
const upload = multer({ dest: 'uploads/cnic_pics/' });

// Route to add a new employee (optional CNIC picture upload)
router.post('/add', verifyToken, upload.single('cnicPic'), addEmployee);

// Route to get all employees added by the authenticated admin
router.get('/my-employees', verifyToken, getAdminEmployees);

// Route to fetch the employee by name 
router.get('/my-employees/search', verifyToken,getEmployeesByName)

router.put('/edit/:id',verifyToken,editEmployee)

// Route to delete the specific Employee
router.delete('/delete/:id', verifyToken, deleteEmployee);


// Route to get a specific employee by ID
router.get('/my-employees/:id', verifyToken, getEmployeeById);

module.exports = router;
