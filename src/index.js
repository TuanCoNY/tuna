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
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(cookieParser());

routes(app);


routes(app);
mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        //console.log('connect Db succses!')
    })
    .catch((err) => {
        //console.log(err)
    })
app.listen(port, () => {
    // console.log('server is running in port', + port)
})