const mongoose = require('mongoose');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Invoice = require('../models/Invoice');
const pdf = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.sellProduct = async (req, res) => {
    const { productId, quantitySold, customerName, customerCNIC, discount = 0 } = req.body;
    const adminId = req.admin._id;

    try {
        // Validate the productId as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid productId provided.' });
        }

        // Validate quantitySold as a positive number
        if (!quantitySold || isNaN(quantitySold) || quantitySold <= 0) {
            return res.status(400).json({ message: 'Quantity sold must be a positive number' });
        }

        if (!customerName || !customerCNIC) {
            return res.status(400).json({ message: 'Customer name and CNIC are required' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure product.sellPrice is a valid number
        if (typeof product.sellPrice !== 'number' || isNaN(product.sellPrice) || product.sellPrice <= 0) {
            return res.status(400).json({ message: 'Invalid product sell price' });
        }

        // Ensure the discount is a valid number
        const validDiscount = isNaN(discount) || discount < 0 ? 0 : discount;

        // Calculate the total price, applying the discount
        const totalPrice = product.sellPrice * quantitySold * (1 - validDiscount / 100);

        // Check if the totalPrice calculation resulted in a valid number
        if (isNaN(totalPrice) || totalPrice <= 0) {
            return res.status(400).json({ message: 'Calculated total price is invalid' });
        }

        // Check if there is enough quantity
        if (product.quantity < quantitySold) {
            return res.status(400).json({ message: 'Not enough quantity available' });
        }

        // Decrement the quantity of the product
        product.quantity -= quantitySold;
        await product.save();

        // Create a sale record
        const sale = new Sale({
            productId,
            adminId,
            quantitySold,
            totalPrice,
            discount: validDiscount,
            customerName,
            customerCNIC,
        });
        await sale.save();

        // Generate an invoice
        const invoiceData = {
            productName: product.name,
            quantitySold,
            totalPrice,
            customerName,
            customerCNIC,
            invoiceNumber: sale._id,
            date: new Date(),
        };
        const invoice = new Invoice({
            saleId: sale._id,
            adminId,
            invoiceData,
            customerName,
            customerCNIC,
        });

        // Generate and save the PDF invoice
        const invoicesDir = path.join(__dirname, '..', 'invoices');
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }
        const pdfPath = path.join(invoicesDir, `invoice_${sale._id}.pdf`);
        generateInvoicePDF(invoiceData, pdfPath);
        invoice.pdfUrl = pdfPath;
        await invoice.save();

        res.status(201).json({
            message: 'Product sold successfully',
            sale,
            invoice,
        });
    } catch (error) {
        console.error('Error in selling product:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to generate an invoice PDF
function generateInvoicePDF(invoiceData, filePath) {
    const doc = new pdf();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    doc.text(`Date: ${invoiceData.date}`);
    doc.text(`Product Name: ${invoiceData.productName}`);
    doc.text(`Quantity Sold: ${invoiceData.quantitySold}`);
    doc.text(`Total Price: $${invoiceData.totalPrice.toFixed(2)}`);
    doc.moveDown();
    doc.text(`Customer Name: ${invoiceData.customerName}`);
    doc.text(`Customer CNIC: ${invoiceData.customerCNIC}`);
    doc.end();
}

// Controller to get a product by ID, ensuring it belongs to the authenticated admin
exports.getProductById = async (req, res) => {
    const { id } = req.params; 
    const adminId = req.admin._id; 

    try {
        // Validate that the provided id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID provided.' });
        }

        // Find the product by ID and ensure it belongs to the authenticated admin
        const product = await Product.findOne({ _id: id, adminId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to access this product.' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAdminSellProducts = async (req, res) => {
    const adminId = req.admin._id; 
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    try {
        // Validate the adminId as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ message: 'Invalid admin ID provided.' });
        }

        // Create query object for fetching all sales by the authenticated admin
        const query = { adminId };

        // Convert sort order to 1 for ascending and -1 for descending
        const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;

        // Get the total count for pagination
        const totalSales = await Sale.countDocuments(query);

        // Fetch the sales records, and sort them
        const sales = await Sale.find(query)
            .populate({
                path: 'productId',
                select: 'name sellPrice',
                options: { strictPopulate: false } 
            })
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Respond with the paginated sales data
        res.status(200).json({
            message: 'Sales fetched successfully',
            totalSales,
            totalPages: Math.ceil(totalSales / limit),
            currentPage: page,
            sales,
        });
    } catch (error) {
        console.error('Error fetching sales by admin:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAdminProductsSell = async (req, res) => {
    const adminId = req.admin._id;

    try {
        const products = await Sale.find({ adminId });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
