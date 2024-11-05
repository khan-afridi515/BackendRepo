// models/Owner.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ownerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'owner' },
}, { timestamps: true });


module.exports = mongoose.model('Owner', ownerSchema);
