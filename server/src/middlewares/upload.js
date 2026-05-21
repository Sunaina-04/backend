const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Security rule 2: only allow image extensions that are expected for verified incident uploads.
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const extensionIsAllowed = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeTypeIsAllowed = allowedImageTypes.test(file.mimetype);

  if (extensionIsAllowed && mimeTypeIsAllowed) {
    return cb(null, true);
  }

  return cb(new Error('Only .jpg, .jpeg, .png, and .webp image files are allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Security rule 1: block files larger than 5MB before they reach the controller.
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;