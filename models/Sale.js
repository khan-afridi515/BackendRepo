const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
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
    },
    discount: {
        type: Number,
        required: true,
    },
    sPrice: {
        type: String
    },
    rPrice: {
        type:String
    },
    productName:{
        type:String
    },
    discountedPrice:{
        type:String
    },
    productMargin:{
        type:String
    },
    invoiceNumber:{
        type:String
    },
    date:{
        type:String,
    },
    productName:{
        type:String
    }
    
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
