const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('📎 File filter check:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    console.log('❌ File rejected: Not a PDF');
    return cb(new Error('Only PDF files are allowed'), false);
  }
  
  console.log('✅ File accepted: PDF');
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Add error handling
upload.single('resume').bind(upload);

module.exports = upload;