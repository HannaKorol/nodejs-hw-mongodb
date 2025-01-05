import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';


//дозволяють зберігати завантажені файли у визначеній директорії з унікальними іменами, що забезпечить організоване та безпечне управління файлами на сервері.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //destination (призначення): Цей параметр визначає, в яку директорію будуть зберігатися завантажені файли
    cb(null, TEMP_UPLOAD_DIR); // TEMP_UPLOAD_DIR вказує на тимчасову директорію для завантажень.
  },
  filename: function (req, file, cb) {
    //filename (ім'я файлу): Цей параметр визначає, яке ім'я буде надане завантаженому файлу.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); //! з лекції 
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
