const express = require('express');
const {
    createOwner,
    ownerLogin,
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
} = require('../controllers/owner');
const { authorizeOwner } = require('../middleware/owner');

const router = express.Router();


router.post('/addOwner', createOwner);
router.post('/login', ownerLogin);           // Owner login
router.post('/admins', authorizeOwner, createAdmin);   // Create a new admin
router.get('/admins', authorizeOwner, getAllAdmins);   // Get all admins
router.put('/admins/:id', authorizeOwner, updateAdmin); // Update an admin
router.delete('/admins/:id', authorizeOwner, deleteAdmin); // Delete an admin

module.exports = router;
