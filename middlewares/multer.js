const multer = require('multer');
const path = require('path');

const filename = (req, file, callback) => {
    console.log(file)
    const fileName = Date.now() + '-' + file.originalname;
    callback(null, fileName)
};

const generateStore = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, destination)
        },
        filename
    })
}

module.exports = {
    image: multer({
        storage: generateStore('./public/images'),
        fileFilter: (req, file, callback) => {
            const allowed = ['image/png', 'image/jpg', 'image/jpeg'];

            if(allowed.includes(file.mimetype)) {
                callback(null, true)
            } else {
                const err = new Error(`Only ${allowed.join(', ')} are allowed to upload`)
            }
        },
        onError: (err, next) => {
            next(err)
        }
    }),

    video: multer({
        storage: generateStore('./public/videos'),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['video/mp4', 'video/x-msvideo', 'video/quicktime'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                callback(err, false);
            }
        },
        onError: (err, next) => {
            next(err);
        }
    }),

    file: multer({
        storage: generateStore('./public/files'),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['application/pdf'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                callback(err, false);
            }
        },
        onError: (err, next) => {
            next(err);
        }
    })    
}