import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const allowedFileTypes = /jpeg|jpg|png|gif/;
// Configuring multer storage
const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb) {
        const uniqueFileName = `${uuidv4()}-${file.originalname}`; 
        cb(null, uniqueFileName); 
    }
});

// File type validation function
const fileFilter = (req, file, cb) => {
    // Check the file extension and MIME type against allowed types
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Accept the file if it passes validation
    } else {
        cb(new Error('Only images are allowed')); // Reject the file with an error if validation fails
    }
};

export const upload = multer({
    storage, // Use the defined storage configuration
    fileFilter, // Use the defined file filter for validation
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB
});