const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const adminRoutes =require('./routes/adminRoutes')
const productRoutes = require('./routes/productRoutes')
const saleproducts= require('./routes/saleRoutes')
const employee = require('./routes/employeesRoutes')

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
}));

connectDB();
app.use(express.json());
app.use('/api/auth', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products',saleproducts);
app.use('/api/employees', employee);
app.use('/api/invoices',require('./routes/invoiceRoutes'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
