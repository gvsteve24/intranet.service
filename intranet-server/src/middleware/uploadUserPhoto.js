const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'avatar');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
        return cb(new Error('Please upload an image.'));
    }

    cb(undefined, true);
}
 
const upload = multer({
    limits: {
        fileSize: 5*1024*1024
    },
    storage: multerStorage,
    fileFilter: multerFilter    
}).single('avatar');

const uploadUserPhoto = (req, res, next) => {
    upload(req, res, function(err){
        if(err instanceof multer.MulterError){
            next(err);
        }
        next();
    });
}
module.exports = uploadUserPhoto;