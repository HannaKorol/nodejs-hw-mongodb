import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import dotenv from 'dotenv';
dotenv.config(); 

const bootstrap = async () => {
    await initMongoConnection();
    setupServer();
};

bootstrap();

/* console.log('MONGODB_USER:', process.env.MONGODB_USER);
console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD);
console.log('MONGODB_DB:', process.env.MONGODB_DB); */

/* console.log(process.env.DB_URI); */