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


// creating app
const app = express();
app.use(bodyParser.json()); 
app.use(cors());




// this is for testing
app.get('/test', (req, res) => {
    console.log('test route is working');
    res.send('Test route is working');
});



// here we will use other middleware 


app.use(authRouter);

app.post('/check',authenticateUser,(req,res)=>{
    

    console.log('this is check user  working  ')
    res.json({
        status: "this is status"
    });

});


  



// port setting from env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is running on port', PORT);
});