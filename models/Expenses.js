const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Expenses', expenseSchema);
