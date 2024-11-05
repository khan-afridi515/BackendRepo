const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Token Verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Get Admin
        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
