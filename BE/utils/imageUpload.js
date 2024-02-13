
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with your API Key and Secret
cloudinary.config({
  cloud_name: 'dzkk7ubqq',
  api_key: '889131577884438',
  api_secret: 'AVh8qLZkL5EFPlkHdmc78YqGNmI',
});

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload an image and return the URL
export const uploadImage = async (file) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(file.buffer, {
      folder: 'course_images', // Specify the folder in Cloudinary
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(error.message);
  }
};
