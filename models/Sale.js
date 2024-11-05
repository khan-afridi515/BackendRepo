const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    quantitySold: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
