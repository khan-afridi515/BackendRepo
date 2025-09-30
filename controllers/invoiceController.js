const { findOneAndDelete } = require('../models/Admin');
const Invoice = require('../models/Invoice');

// Controller to get invoices by customer name or CNIC 
exports.getInvoicesByCustomer = async (req, res) => {
    const { customerName, customerCNIC } = req.query;
    const adminId = req.admin._id;

    try {
        // Ensure that at least one of customerName or customerCNIC is provided
        if (!(customerName?.trim()) && !(customerCNIC?.trim())) {
            return res.status(400).json({
                message: 'Please provide either a customer name or CNIC for the search.'
            });
        }

        const query = { adminId };

        if (customerName?.trim()) {
            query.customerName = { $regex: new RegExp(customerName, 'i') };
         }

        // Add customer CNIC to the search query if provided
        if (customerCNIC?.trim()) {
            query.customerCNIC = customerCNIC; 
        }

        // Find invoices that match the query
        const invoices = await Invoice.find(query);

        // If no invoices are found, return a 404 message
        if (invoices.length === 0) {
            return res.status(404).json({
                message: 'No invoices found for the given criteria.'
            });
        }

        // Return the list of matched invoices
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.AllSellInvoice= async(req, res) =>{
    try{
         const allInvoices = await Invoice.find();
         if(!allInvoices || allInvoices.length === 0) return res.status(400).json({wrn:"Product not founded"});
         return res.status(200).json({msg:"all sels products successfully finded.", productss:allInvoices})
    }
    catch(err){
        console.log(err);
    }
}

exports.invoiceDelete = async(req, res)=>{
    try{
         const { id } = req.params;
         const adminId = req.admin._id;

         const dltInvoice = await Invoice.findByIdAndDelete({_id: id, adminId});
         if(!dltInvoice){
            return res.status(400).json({wrn:"invoice not deleted!"});

         } 
         return res.status(200).json({msg:"Invoice has been deleted", removeInvoice:dltInvoice})
    }
    catch(err){ 
        console.log(err);
    }
}
