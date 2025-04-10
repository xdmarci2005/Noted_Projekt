import util from 'util';
import multer from 'multer';    
import dotenv from 'dotenv';

dotenv.config();

const uploadDir = process.env.UPLOAD_DIR_NAME || 'Notes/uploads';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,process.cwd() + uploadDir);
    },
    filename: function (req, file, cb) {
        const safeName = Buffer.from(file.originalname, 'utf8').toString('utf8')
        cb(null,Date.now() + "_" + safeName);
    }
});

const upload = multer({ storage: storage }).single('file');

export const uploadFile = util.promisify(upload);