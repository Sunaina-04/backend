const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

// Cloudinary reads CLOUDINARY_URL automatically from the environment.
// This keeps credentials out of source code and matches the standard SDK flow.
cloudinary.config({
  secure: true
});

const uploadImage = async (filePath) => {
  if (!filePath) {
    throw new Error('A local file path is required for Cloudinary upload.');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'incident_reports',
    transformation: [
      {
        width: 1000,
        crop: 'limit'
      },
      {
        quality: 'auto'
      },
      {
        fetch_format: 'auto'
      }
    ]
  });

  return result.secure_url;
};

module.exports = {
  cloudinary,
  uploadImage
};