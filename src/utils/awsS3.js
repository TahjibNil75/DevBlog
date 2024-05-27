import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

// Create a new instance of the S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const uploadToS3 = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        // Read the file from the local file system
        const fileContent = fs.readFileSync(localFilePath);
        const fileName = localFilePath.split('/').pop(); // Extract the file name from the file path

        // Set up S3 upload parameters
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName, // File name to be saved in the S3 bucket (capital 'K' for 'Key')
            Body: fileContent, // File content to be uploaded
            ContentType: 'auto'
        };

        const command = new PutObjectCommand(params);

        const response = await s3Client.send(command);
        console.log("File uploaded successfully to S3", response.Location);
        fs.unlinkSync(localFilePath); // Remove the local file after successful upload
        return response; // Return the response from the S3 upload
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the local file if an error occurs
        console.log("Error uploading file to S3", error);
        return null; // Return null to indicate the upload failed
    }
}

export { uploadToS3 };
