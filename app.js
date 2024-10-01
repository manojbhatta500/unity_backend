const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
    authenticateUser
} = require('./middlewares/authenticate.user');


// config for using dotenv
require('dotenv').config();


// importing db connections
const db = require('./db');


// importing diffrent routers
const authRouter = require('./routers/auth.router')

// importing general routers
const generalRouter = require('./routers/general.router');

// importing post routers

const postRouter = require('./routers/post.router');

// user router 

const userRouter = require('./routers/user.router');


const path = require('path');


const multerConfig = require('./multerConfig');


// creating app
const app = express();
app.use(bodyParser.json()); 
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use(authRouter);


app.use(generalRouter);


app.use(postRouter);

app.use(userRouter);



// port setting from env
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('server is running on port', PORT);
});


