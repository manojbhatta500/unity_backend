const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();


const {loginwithemail} = require('./routers/auth.router')

const app = express();

app.use(bodyParser.json()); 
app.use(cors());

app.get('/test', (req, res) => {
    console.log('test route is working');
    res.send('Test route is working');
});


app.use('/auth',loginwithemail);


  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is running on port', PORT);
});