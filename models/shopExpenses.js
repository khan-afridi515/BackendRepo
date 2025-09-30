const mongoose = require('mongoose');


const myShopExpenses = new mongoose.Schema({
    shopRent : {
        type:Number,
        required:true,
    },

    bill : {
       type : Number,
       required:true
    },

    employPay:{
      type : Number,
      required:true
    },
    Gst:{
       type:Number,
    },
    totalExpense:{
      type:Number
    },
    other:{
      type:Number
    }
}, {timestamps:true})

module.exports = mongoose.model('sExpenses', myShopExpenses);