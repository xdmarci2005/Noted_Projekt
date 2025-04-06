import util from 'util';
import multer from 'multer';    
import dotenv from 'dotenv';

dotenv.config();

const uploadDir = process.env.UPLOAD_DIR_NAME || '/uploads';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,process.cwd() + uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now() + "_" + file.originalname.toString('Latin-2'));
    }
});

const upload = multer({ storage: storage }).single('file');

export const uploadFile = util.promisify(upload);