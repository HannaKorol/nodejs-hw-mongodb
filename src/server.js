import express from 'express';

const PORT = 3000;

export const setupServer = () => {
    const app = express();

    app.get('/contacts', async (req, res) => {
        res.send({ satus: 200, data: ['Contacts'] });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        console.log(req.params);
        res.send({status: 200, data: 'Contact'} );
    });


    app.get('/', (req, res) => {
        res.send('Hello World)');
    });

    app.use((req, res, next) => {
        res.status(404).send({ message: "Not Found"});
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};



const message = "Hello Node";

console.log(message);
