
const multer = require('multer');
const path = require('path');

// Multer Storage for Seller Profile
const Sellers_Files = path.join(__dirname, '../Sellers_Files');
const Seller_Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb( null , Sellers_Files );
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ' - ' + file.originalname);
    }
});

const Seller_Upload = multer({ 
        storage: Seller_Storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: function (req, file, cb) {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg') {
                cb(null, true);
            } else {
                cb(new Error('Only .jpg , .jpeg , .webp , .gif and .png files are allowed!'), false);
            }
        }
    }).fields([
        { name: 'Img', maxCount: 1 },
        { name: 'Shop_Img', maxCount: 1 }
    ]);

const Multer_Storage_Seller_Profile = async (req, res, next) => {
    try {
        Seller_Upload(req, res, (error) => {

            if (error) {
                return next(error);
            }
            next();
        });
    } catch (error) {
        next(error);
    };
};

module.exports = {
    Multer_Storage_Seller_Profile,
}