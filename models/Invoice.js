const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    invoiceData: {
        type: Object,
        required: true,
    },
    pdfUrl: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerCNIC: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Avoid OverwriteModelError by checking if the model already exists
module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
