import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
/* import 'dotenv/config.js';
 */

const bootstrap = async () => {
    await initMongoConnection();
    setupServer();
};

bootstrap();

/* console.log(process.env.DB_URI); */