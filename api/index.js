const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDB = require('../config/db');
const cors = require('cors');
const adminRoutes =require('../routes/adminRoutes')
const productRoutes = require('../routes/productRoutes')
const saleproducts= require('../routes/saleRoutes')
const employee = require('../routes/employeesRoutes')
const invoice = require('../routes/invoiceRoutes')
const borrow = require('../routes/borrowPersonRoutes')
const expenses = require('../routes/expensesRoutes')
const owner = require('../routes/ownerRoutes')
const sExpenses = require('../routes/shopExpenseRoute');


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
}));


const PORT = process.env.PORT || 5000;

connectDB();
// app.use(express.json());
// app.use('/api/auth',adminRoutes);
// app.use('/api/products',productRoutes);
// app.use('/api/sellProducts',saleproducts);
// app.use('/api/employees',employee);
// app.use('/api/invoices',invoice);
// app.use('/api/borrow',borrow);
// app.use('/api/expenses',expenses);
// app.use('/api/owner',owner)
// app.use('/api/shopExpense',sExpenses);


app.use(express.json());
app.use('/auth',adminRoutes);
app.use('/products',productRoutes);
app.use('/sellProducts',saleproducts);
app.use('/employees',employee);
app.use('/invoices',invoice);
app.use('/borrow',borrow);
app.use('/expenses',expenses);
app.use('/owner',owner)
app.use('/shopExpense',sExpenses);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// const serverless = require("serverless-http");
// module.exports = serverless(app);
module.exports = app;