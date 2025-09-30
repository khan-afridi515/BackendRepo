const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');




exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare Password
        // if (admin.password !== password) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }

        const myAdmin = await bcrypt.compare(password, admin.password);

        if(!myAdmin) return res.status(402).json({wrn:"Your password doesn't match!"});
        // Generate JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '9h' });
        return res.status(200).json({msg:"Successfully admin loggedin", adminToken: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getAdminProfile = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token and extract the adminId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId).select('-password'); // Exclude password field

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        //Admin details
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};