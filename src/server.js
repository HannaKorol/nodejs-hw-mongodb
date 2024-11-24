import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import { ContactsCollection } from './db/models/contacts.js';
import { initMongoConnection } from './db/initMongoConnection.js'; // Импортируй функцию
/* import 'dotenv/config.js';
 */
import mongoose from 'mongoose';
import { getAllContacts, getContactById } from './services/contacts.js'; 


dotenv.config();
const PORT = Number(env('PORT', '3000')); 


export const setupServer = async () => {
    const app = express();
    app.use(express.json());

    app.use(cors());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.get('/', (req, res) => {
        res.send('Hello World)');
    });

    app.get('/contacts', async (req, res) => {
    /*         const contacts = await Contact.find();
     */ const contacts = await getAllContacts();
        res.send({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params; // Extract contactId from params
        const contact = await getContactById(contactId);
        console.log(req.params);

        if (!contact) {
            res.status(404).send({
                status: 404,
                message: `Contact with id ${contactId} not found!`, // Use template literals
            });
            return;
        }

        res.send({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    });

    app.use('*', (req, res) => {
        res.status(404).send({ message: 'Not Found' });
    });

    try {
        await initMongoConnection(); // Ждем, пока соединение будет установлено
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to establish MongoDB connection:', error);
    }

    /*   app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }; */
};

/* const message = "Hello Node";

console.log(message); */

/* setupServer(); */
