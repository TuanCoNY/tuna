const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require('./routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors')
dotenv.config()

const app = express()
const port = process.env.PORT || 3001
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());



routes(app);
mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});