const Expense = require('../models/Expenses');
const mongoose = require('mongoose');

// Controller to add a new expense
exports.addExpense = async (req, res) => {
    const { description, amount, date } = req.body;
    const adminId = req.admin._id;

    try {
        // Validate required fields
        if (!description || amount == null || amount < 0 || !date) {
            return res.status(400).json({ message: 'Description, amount, and date are required' });
        }

        // Create a new expense instance
        const expense = new Expense({
            description,
            amount,
            date,
            adminId,
        });

        // Save the expense to the database
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to fetch all expenses for the authenticated admin
exports.getAdminExpenses = async (req, res) => {
    const adminId = req.admin._id;

    try {
        // Find all expenses where adminId matches the authenticated admin
        const expenses = await Expense.find({ adminId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to fetch expenses by month for the authenticated admin
exports.getMonthlyExpenses = async (req, res) => {
    const adminId = req.admin._id;
    const { month, year } = req.query; // Get month and year from query parameters

    try {
        // Validate month and year
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        // Find expenses for the given month and year
        const expenses = await Expense.find({
            adminId,
            date: {
                $gte: new Date(year, month - 1, 1), // Start of the month
                $lt: new Date(year, month, 1), // Start of the next month
            },
        }).sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching monthly expenses:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to edit an expense's details
exports.editExpense = async (req, res) => {
    const { id } = req.params; // The expense ID from the URL
    const adminId = req.admin._id; // The authenticated admin's ID
    const { description, amount, date } = req.body; // Updated fields

    try {
        // Validate that the provided id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid expense ID provided.' });
        }

        // Find the expense by ID and ensure it belongs to the authenticated admin
        const expense = await Expense.findOne({ _id: id, adminId });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or you do not have permission to edit this expense.' });
        }

        // Update expense details with provided fields
        if (description) expense.description = description;
        if (amount != null && amount >= 0) expense.amount = amount; // Amount should not be negative
        if (date) expense.date = date;

        // Save the updated expense details
        await expense.save();

        res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        console.error('Error editing expense:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to delete an expense by ID
exports.deleteExpense = async (req, res) => {
    const { id } = req.params; // The expense ID from the URL
    const adminId = req.admin._id; // The authenticated admin's ID

    try {
        // Validate that the provided id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid expense ID provided.' });
        }

        // Find and delete the expense if it belongs to the authenticated admin
        const expense = await Expense.findOneAndDelete({ _id: id, adminId });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or you do not have permission to delete this expense.' });
        }

        res.status(200).json({ message: 'Expense deleted successfully', expense });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
