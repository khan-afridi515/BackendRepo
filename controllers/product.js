const Product = require('../models/Product');

// Controller to add a new product
exports.addProduct = async (req, res) => {
    const { name, retailprice, sellPrice, category, uniqueId, quantity } = req.body;
    const adminId = req.admin._id;

    try {
        // Validate that all required fields are present
        if (!name || retailprice == null || sellPrice == null || !category || !uniqueId || quantity == null) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new product instance
        const product = new Product({
            name,
            retailprice,
            sellPrice,
            category,
            uniqueId,
            quantity,
            adminId,
        });

        // Save the product to the database
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            // Unique constraint error for uniqueId
            return res.status(400).json({ message: 'Unique ID already exists' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.productDeleted = async (req, res) => {
    try{
       const allProduct  = await Product.deleteMany();

       return res.status(200).json({msg:"All sell product has been deleted", deletedProduct:allProduct})
    }
    catch(err){
        console.log(err)
    }
}

// Controller to fetch all products added by the authenticated admin
exports.getAdminProducts = async (req, res) => {
    const adminId = req.admin._id;

    try {
        const products = await Product.find({ adminId });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to get a product by ID, ensuring it belongs to the authenticated admin
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        const product = await Product.findOne({ _id: id, adminId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to access this product' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.searChProduct = async (req, res) => {
    try{
         const {name, category} = req.body;
         const adminId = req.admin._id;


         const query = {
            $or:[]
        };

        const productOne = []
         
        if(name){
            item = await Product.findOne({name: {$regex: `^${name}`, $options:"i"}})
            productOne.push(item)
        }else if(category){
            itemm = await Product.find({category: {$regex: `^${category}`, $options:"i"}})
            productOne.push(itemm);
        }else{
            return res.status(402).json({wrn:"Please name or category"})
        }
        //  if(name){
        //     query.$or.push({name: {$regex : `^${name}$`, $options:"i"}})
        //  }

        //  if(category){
        //     query.$or.push({category: {$regex : `^${category}$`, $options:"i"}})
        //  }

        //  if(query.$or.length === 0){
        //     return res.status(401).json({wrn:"please provide name or categary"});
        //  }
         
        //  const productOne = await Product.findOne(query);
         //  const employOne = await Employee.findOne({name: {$regex: `^${name}$`, $options:"i"}});

         if(!productOne){
            return res.status(400).json({wrn:"Product does not found"})
         }

         return res.status(200).json({msg:"Product successfully find!", productOne})
    }
    catch(err){
            console.log(err);
    }
}


// Controller to edit a product by ID
exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;
    const updates = req.body; 

    try {
        const product = await Product.findOneAndUpdate(
            { _id: id, adminId },
            updates,
            { new: true } 
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to edit this product' });
        }

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Controller to delete a product by ID
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        const product = await Product.findOneAndDelete({ _id: id, adminId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to delete this product' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

