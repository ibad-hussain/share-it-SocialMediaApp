// Import Multer
const multer = require('multer');


// Import required modules
const path = require('path');
const crypto = require('crypto');


// Setup DiskStorage to upload file on the server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            const fn = name.toString("hex") + path.extname(file.originalname);
            cb(null, fn)
        })
    }
})


// Create 'upload' variable
const upload = multer({ storage: storage })


// Export 'upload' variable
module.exports = upload;
