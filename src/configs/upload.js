const path = require("path");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    let uploadPath = '';

    if (req.baseUrl === '/v1/auth/signup' || req.baseUrl === '/v1/user') {
      uploadPath = path.join(__dirname, '../public/uploads/users/');
    } else if (req.baseUrl === '/v1/articles') {
      uploadPath = path.join(__dirname, '../public/uploads/articles/');
    } else if (req.baseUrl === '/v1/homepage') {
      const uploadBasePath = path.join(__dirname, '../public/uploads/homePage');
      const headerImagePath = path.join(uploadBasePath, 'headerImages');
      const footerImagePath = path.join(uploadBasePath, 'footerImages');

      // Create the 'home_page', 'header_images', and 'footer_images' directories if they don't exist
      if (!fs.existsSync(uploadBasePath)) {
        fs.mkdirSync(uploadBasePath, { recursive: true });
      }

      if (!fs.existsSync(headerImagePath)) {
        fs.mkdirSync(headerImagePath, { recursive: true });
      }

      if (!fs.existsSync(footerImagePath)) {
        fs.mkdirSync(footerImagePath, { recursive: true });
      }

      // Determine the destination based on the file type
      if (file.fieldname === 'headerImage') {
        uploadPath = headerImagePath;
      } else if (file.fieldname === 'footerImage') {
        uploadPath = footerImagePath;
      }
    } else if (req.baseUrl === '/v1/about') {
      const uploadBasePath = path.join(__dirname, '../public/uploads/aboutPage');

      if (!fs.existsSync(uploadBasePath)) {
        fs.mkdirSync(uploadBasePath, { recursive: true });
      }

      uploadPath = uploadBasePath;
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

module.exports = multer({ storage });