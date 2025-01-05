import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

import dotenv from 'dotenv';
dotenv.config(); 

const bootstrap = async () => {
  await initMongoConnection();
 await createDirIfNotExists(TEMP_UPLOAD_DIR);
 await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};


bootstrap();

/* console.log('ENABLE_CLOUDINARY:', process.env.ENABLE_CLOUDINARY);
console.log('CLOUD_NAME:', process.env.CLOUD_NAME);
console.log('API_KEY:', process.env.API_KEY);
console.log('API_SECRET:', process.env.API_SECRE); */
