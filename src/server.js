import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './routers/index.js';
import dotenv from 'dotenv';
import { env } from './utils/env.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';


import { ContactsCollection } from './db/models/contacts.js';
import { initMongoConnection } from './db/initMongoConnection.js'; // Импортируй функцию

import { UPLOAD_DIR } from './constants/index.js';
  
import { swaggerDocs } from './middlewares/swaggerDocs.js';

import mongoose from 'mongoose';
dotenv.config();
const mongoUri = process.env.DB_URI; // Используйте переменную окружения для URI

const PORT = Number(env('PORT', '3000')); 

export const setupServer = async () => {
    const app = express();


    app.use(
      express.json({
        type: ['application/json', 'application/vnd.api+json'],
        limit: '100kb',
      }),
    );

    app.use(cors());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/api-docs', swaggerDocs());

//Module 5. Cookies 
    app.use(cors());
    app.use(cookieParser());

app.use('/uploads', express.static(UPLOAD_DIR));


    app.get('/', (req, res) => {
        res.send('Hello World)');
    });

    app.use(router);

    app.use('*', notFoundHandler);
    app.use(errorHandler);
  /*   app.use('*', (req, res, next) => { */

    /*  app.use((err, req, res, next) => {
       
     }); */

    try {
        await initMongoConnection(); // Ждем, пока соединение будет установлено
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to establish MongoDB connection:', error);
    }
};



