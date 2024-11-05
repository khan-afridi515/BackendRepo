const express = require('express');
const router = express.Router();
const { getAdminProfile, login } = require('../controllers/admin');

// Route for login the admin 
router.post('/login', login);

// ROute to fetch the admin details 
router.get('/admin/me',getAdminProfile);

module.exports = router;
