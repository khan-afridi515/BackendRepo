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

//token3 = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjhjM2I2MzBhZjk3MjQ1MGRlNjZmMmU4IiwiaWF0IjoxNzU4Nzc2NTAzLCJleHAiOjE3NTg4MDg5MDN9.6JtF7ghZDMIwJFM-krp4NkPN_Ms_hOSaUgHzab5SNzAn

//owner:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lcklkIjoiNjhkYTRlMTNhYjhmZWFhYmU0OWU5YzhhIiwiaWF0IjoxNzU5MTM3Mzg4LCJleHAiOjE3NTkxNjk3ODh9.VeMgn_mJOdA7WtcY-PSGELdsoKzLTfBhuq2fkPZ5LvI

// admin login = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjhkYTRmMzhhYjhmZWFhYmU0OWU5YzhlIiwiaWF0IjoxNzU5MTM3NzA5LCJleHAiOjE3NTkxNzAxMDl9.uU0uOpObTZOKTpxSQA1oWlsMekc0iwvtcX2dGgs7SyA