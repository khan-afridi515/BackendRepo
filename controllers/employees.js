const Employee = require('../models/Employees');
const fileOnCloudinary = require('./cloudinary');

// Controller to add a new employee
exports.addEmployee = async (req, res) => {
    const { name, email, mob, CNIC, salary, shift, dateOfJoining, empId, role, workingHours, status } = req.body;
    const adminId = req.admin._id; 
    const cnicPic = req.file ? req.file.path : null; 

    try {
        // Validate required fields
        if (!name || !email || !mob || !CNIC || !salary || !shift || !dateOfJoining) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
       
        let image_Url = "";
        if(req.file){
            const imgSrc = await fileOnCloudinary(req.file.path);
            image_Url = imgSrc.secure_url;
        }
        // Create a new employee instance
        const employee = new Employee({
            name,
            email,
            empId,
            mob,
            CNIC,
            salary,
            shift,
            dateOfJoining,
            cnicPic:image_Url,
            adminId,
            role,
            workingHours,
            status
        });

        // Save the employee to the database
        await employee.save();
        res.status(201).json({ message: 'Employee added successfully', employee });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            // Handle unique constraint errors for email and CNIC
            return res.status(400).json({ message: 'Email or CNIC already exists' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET All Admin
exports.getAdminEmployees = async (req, res) => {
    const adminId = req.admin._id;

    try {
        console.log("This is adminId",adminId);
        const employees = await Employee.find({ adminId:adminId.toString()});
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.searChbyName = async (req, res) => {
    try{
         const {name, CNIC} = req.body;

         const query = {
            $or:[]
        };

         if(name){
            query.$or.push({name: {$regex : `^${name}$`, $options:"i"}})
         }

         if(CNIC){
            query.$or.push({CNIC: CNIC});
         }

         if(query.$or.length === 0){
            return res.status(401).json({wrn:"please provide name or CNIC"});
         }

         const employOne = await Employee.findOne(query);
        //  const employOne = await Employee.findOne({name: {$regex: `^${name}$`, $options:"i"}});

         if(!employOne){
            return res.status(400).json({wrn:"Employ does not found"})
         }

         return res.status(200).json({msg:"Employ successfully find!", employOne})
    }
    catch(err){
            console.log(err);
    }
}

// Controller to get a specific employee by ID, 
exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        const employee = await Employee.findOne({ _id: id, adminId });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or you do not have permission to access this employee' });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
 
 // Controller to get employees by name for the authenticated admin
exports.getEmployeesByName = async (req, res) => {
    const { name } = req.query; // Get the name from query parameters
    const adminId = req.admin._id;

    try {
        // Ensure that a name is provided
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name query parameter is required' });
        }

        // Find employees that match the name and belong to the authenticated admin
        const employees = await Employee.find({
            adminId,
            name: { $regex: new RegExp(name, 'i') } // Case-insensitive search
        });

        // If no employees are found, return a 404 message
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found with the provided name' });
        }

        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to delete an employee by ID
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        // Find and delete the employee if it belongs to the authenticated admin
        const employee = await Employee.findOneAndDelete({ _id: id, adminId });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or you do not have permission to delete this employee' });
        }

        res.status(200).json({ message: 'Employee deleted successfully', employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Controller to edit an employee's details
exports.editEmployee = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;
    const { name, email, mob, CNIC, salary, shift, dateOfJoining, role, workingHours, status } = req.body;
    const cnicPic = req.file ? req.file.path : undefined; // Handle optional update of CNIC picture

    try {
        const updateInfo = {
            name:name, 
            email:email,
            mob:mob, 
            CNIC:CNIC,
            salary:salary,
            shift:shift,
            dateOfJoining:dateOfJoining,
            role:role,
            workingHours:workingHours,
            status:status
        }

        if(req.file){
            const uploadImg = await fileOnCloudinary(req.file.path);
            updateInfo.cnicPic = uploadImg.secure_url
        }

        const updateEmploy = await Employee.findByIdAndUpdate({_id: id, adminId} , updateInfo, {new:true})

        res.status(200).json({ message: 'Employee updated successfully', updateEmploy });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            // Handle unique constraint errors for email and CNIC
            return res.status(400).json({ message: 'Email or CNIC already exists' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};
