const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadImage = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'grocery-products',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary by public ID
 * @param {String} publicId - The public ID of the image
 * @returns {Promise<Object>} Cloudinary deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Get optimized image URL
 * @param {String} publicId - The public ID of the image
 * @param {Object} options - Transformation options
 * @returns {String} Optimized image URL
 */
const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getOptimizedUrl,
};
