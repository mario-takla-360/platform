require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
//const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

//Connect to MongoDB
const connectDB = require('./db/connect');

//Routers

//Middleware
app.use(cors()); //Enable CORS
app.use(bodyParser.json()); //Parse incoming request bodies
app.use(express.json()); //Parse JSON data
app.use(express.static('public')); //Serve static files from the 'public' directory

//Routes

//Error Handler
//const errorHandlerMiddleware = require('./middleware/error-handler');

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        //Connect to MongoDB
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}... `);
        });
    } catch (error) {
        console.log(error);
    }
};
start();