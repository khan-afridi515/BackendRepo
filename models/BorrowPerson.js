const mongoose = require('mongoose');

const borrowPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    cnic: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate CNICs
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    dues: {
        type: Number,
        required: true,
        min: 0, // Dues should not be negative
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    cnicImg:{
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model('BorrowPerson', borrowPersonSchema);
