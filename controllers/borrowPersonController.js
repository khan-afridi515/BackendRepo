const BorrowPerson = require('../models/BorrowPerson');
const mongoose = require('mongoose');
const fileOnCloudinary = require('./cloudinary');


// Controller to add a new borrow person
exports.addBorrowPerson = async (req, res) => {
    const { name, cnic, address, dues} = req.body;
    const adminId = req.admin._id;

    try {
        // Validate that all required fields are present
        if (!name || !cnic || !address || dues == null) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let imgPath = " ";
        if(req.file){
            let imgLink = await fileOnCloudinary(req.file.path);
            imgPath = imgLink.secure_url;
        }

        // Create a new borrow person instance
        const borrowPerson = new BorrowPerson({

            name,
            cnic,
            address,
            dues,
            adminId,
            cnicImg:imgPath
            
        });

        // Save the borrow person to the database
        await borrowPerson.save();
        res.status(201).json({ message: 'Borrow person added successfully', borrowMan:borrowPerson });
    } catch (error) {
        console.error('Error adding borrow person:', error);
        if (error.code === 11000) {
            // Unique constraint error for duplicate CNIC
            return res.status(400).json({ message: 'A person with this CNIC already exists' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to fetch all borrow persons added by the authenticated admin
exports.getAdminBorrowPersons = async (req, res) => {
    const adminId = req.admin._id;

    try {
        // Find all borrow persons where adminId matches the authenticated admin
        const borrowPersons = await BorrowPerson.find({ adminId });
        res.status(200).json(borrowPersons);
    } catch (error) {
        console.error('Error fetching borrow persons:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to get a borrow person by ID, ensuring it belongs to the authenticated admin
exports.getBorrowPersonById = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        // Validate that the provided id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid borrow person ID provided.' });
        }

        // Find the borrow person by ID and ensure it belongs to the authenticated admin
        const borrowPerson = await BorrowPerson.findOne({ _id: id, adminId });

        if (!borrowPerson) {
            return res.status(404).json({ message: 'Borrow person not found or you do not have permission to access this person.' });
        }

        res.status(200).json(borrowPerson);
    } catch (error) {
        console.error('Error fetching borrow person by ID:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.searChBorrow = async (req, res) => {
    try{
         const {name, cnic} = req.body;

         const query = {
            $or:[]
        };

         if(name){
            query.$or.push({name: {$regex : `^${name}$`, $options:"i"}})
         }

         if(cnic){
            query.$or.push({cnic: cnic});
         }

         if(query.$or.length === 0){
            return res.status(401).json({wrn:"please provide name or CNIC"});
         }

         const employOne = await BorrowPerson.findOne(query);
        //  const employOne = await Employee.findOne({name: {$regex: `^${name}$`, $options:"i"}});

         if(!employOne){
            return res.status(400).json({wrn:"Borrow does not found"})
         }

         return res.status(200).json({msg:"Borrow successfully find!", employOne})
    }
    catch(err){
            console.log(err);
    }
}


// Controller to edit a borrow person's details
exports.editBorrowPerson = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;
    const { name, cnic, address, dues } = req.body;

    try {
        // Validate that the provided id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid borrow person ID provided.' });
        }

        // Find the borrow person by ID and ensure it belongs to the authenticated admin
        // const borrowPerson = await BorrowPerson.findOne({ _id: id, adminId });

        // if (!borrowPerson) {
        //     return res.status(404).json({ message: 'Borrow person not found or you do not have permission to edit this person.' });
        // }

        const newDetails = {
            name : name,
            cnic : cnic,
            address : address,
            dues : dues
        }
  
        
        if(req.file){
            const imgSrc = await fileOnCloudinary(req.file.path);
            newDetails.cnicImg = imgSrc.secure_url;
        }


        const updateDetails = await BorrowPerson.findByIdAndUpdate({_id:id, adminId}, newDetails, {new:true})

        // Update borrow person details with provided fields
        // if (name) borrowPerson.name = name;
        // if (cnic) borrowPerson.cnic = cnic;
        // if (address) borrowPerson.address = address;
        // if (dues != null) borrowPerson.dues = dues;

        // Save the updated borrow person details
        // await borrowPerson.save();

        res.status(200).json({ message: 'Borrow person updated successfully', updateDetails });
    } catch (error) {
        console.error('Error editing borrow person:', error);
        if (error.code === 11000) {
            // Handle unique constraint errors for CNIC
            return res.status(400).json({ message: 'A person with this CNIC already exists' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};


// Controller to delete a borrow person by ID
exports.deleteBorrowPerson = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        // Validate that the provided id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid borrow person ID provided.' });
        }

        // Find and delete the borrow person if it belongs to the authenticated admin
        const borrowPerson = await BorrowPerson.findOneAndDelete({ _id: id, adminId });

        if (!borrowPerson) {
            return res.status(404).json({ message: 'Borrow person not found or you do not have permission to delete this person.' });
        }

        res.status(200).json({ message: 'Borrow person deleted successfully', borrowPerson });
    } catch (error) {
        console.error('Error deleting borrow person:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
