import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
/* import 'dotenv/config.js';
 */
import mongoose from 'mongoose';


import { getAllContacts, getContactById } from './services/contacts';
 

dotenv.config();

const PORT = Number(env('PORT', '3000')); //!!!

export const setupServer = () => { //!!!
    const app = express();  //!!!
    
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
      const contacts = await getAllContacts();

    res.send({
      satus: 200,
      message: 'Successfully found contacts!',
      data: ['contacts'],
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    console.log(req.params);
    res.send({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: 'Contact',
    });
  });



  app.use('*', (req, res, next) => {
                                                                    //!!!
    res.status(404).send({ message: 'Not Found' });
  });
    
    

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); //!!!
  });
};


const message = "Hello Node";

console.log(message);
