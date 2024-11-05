const express = require('express');
const {
    addExpense,
    getAdminExpenses,
    getMonthlyExpenses,
    editExpense,
    deleteExpense
} = require('../controllers/expensesController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Route to add a new expense
router.post('/add', verifyToken, addExpense);

// Route to get all expenses added by the authenticated admin
router.get('/my-expenses', verifyToken, getAdminExpenses);

// Route to get expenses for a specific month
router.get('/monthly', verifyToken, getMonthlyExpenses);

// Route to edit an expense's details by ID
router.put('/edit/:id', verifyToken, editExpense);

// Route to delete an expense by ID
router.delete('/delete/:id', verifyToken, deleteExpense);

module.exports = router;