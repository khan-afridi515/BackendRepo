const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv');
const fs = require('fs');


dotenv.config();

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    
    });

const fileOnCloudinary = async(filePath) =>{
   try{

    if(!filePath) return null

    const response = await cloudinary.uploader.upload(filePath, {
        resource_type:"auto"
    })

    console.log("This is file on cloudinary", response);

    return response;

   }
   catch(err){
    console.log(err);
   }
}

module.exports = fileOnCloudinary;