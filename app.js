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









// this is for testing
// app.post('/test',multerConfig.single('image'), (req, res) => {

//     console.log('/test function is running ');
  
//     const file = req.file; 

//     const {postId} = req.body;



//     if (!file ) {
//         return res.status(400).json({
//             status: "error",
//             message: "Image and post id is required."
//         });
//     }

//     return res.status(200).json({
//         status : "success",
//         message : "successfully tested."
//     });
// });







// here we will use other middleware 


app.use(authRouter);


app.use(generalRouter);


app.use(postRouter);

app.use(userRouter);



// app.post('/check',authenticateUser,(req,res)=>{
//     console.log('this is check user  working  ')
//     res.json({
//         status: "this is status"
//     });

// });


// port setting from env
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('server is running on port', PORT);
});


