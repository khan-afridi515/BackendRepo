const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    empId:{
        type:String,
        required:true,
        unique:true,
    },
    mob: {
        type: String,
        required: true,
    },
    CNIC: {
        type: String,
        required: true,
        unique: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    shift: {
        type: String,
        required: true,
    },
    dateOfJoining: {
        type: Date,
        required: true,
    },
    cnicPic: {
        type: String, 
        default: null,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    role:{
      type:String,
      required:true
    },
    workingHours:{
        type:String
    },
    status:{
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
