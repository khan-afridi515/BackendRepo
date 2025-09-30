const sExpenses = require('../models/shopExpenses');

exports.expenses = async(req, res) => {
    try{
        const { shopRent, bill, employPay, Gst, other } = req.body;

        if(!shopRent || !bill || !employPay || !Gst){
            return res.status(400).json({wrn:"All fields are require"})
        }

        const totalValues = [Number(shopRent), Number(bill), Number(employPay), Number(Gst), Number(other)];
        const totalExpense = totalValues.reduce((a,b)=> a+b, 0)

        const createExpense = await sExpenses.create({shopRent, bill, employPay, Gst, totalExpense, other});
         return res.status(200).json({msg:"Expense successfully created", allExpense:createExpense})
  
    }catch(err){
       console.log(err);
    }
}