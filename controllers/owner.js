// controllers/ownerController.js
const Admin = require('../models/Admin');
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Owner login
exports.ownerLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare Password
        if (owner.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, { expiresIn: '9h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Create a new admin with name, email, and password (only accessible by owner)
exports.createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin instance
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully', newAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all admins (only accessible by owner)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password'); // Exclude password for security
        res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update an admin (only accessible by owner)
exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (password) admin.password = await bcrypt.hash(password, 10);

        await admin.save();
        res.status(200).json({ message: 'Admin updated successfully', admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete an admin (only accessible by owner)
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};