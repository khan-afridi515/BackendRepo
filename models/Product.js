const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    retailprice: {
        type: Number,
        required: true,
        min: 0,
    },
    sellPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    margin: {
        type: Number,
        required: true,
        default: 0, // It will be calculated automatically before saving
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
}, { timestamps: true });

// Pre-save hook to calculate margin before saving
productSchema.pre('save', function (next) {
    this.margin = this.sellPrice - this.retailprice;
    next();
});

module.exports = mongoose.model('Product', productSchema);
