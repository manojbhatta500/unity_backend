const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const multer = require('multer'); 




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); 
    }
  });
  
  const upload = multer({ storage });


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


app.use(generalRouter);


app.use(postRouter);


app.post('/upload', upload.single('image'), (req, res) => {
    const postId = req.body.postId;
  
    if (!postId) {
      return res.status(500).json({
        status: 'error',
        message: 'Post ID is required.'
      });
    }
  
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Image file is required.'
      });
    }
  
    res.json({
      status: 'success',
      message: 'File uploaded successfully.',
      filePath: `uploads/${req.file.filename}`,
      postId: postId
    });
  });
  












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


//  otp model  takes email : and saves otp 
// how 
// forgot password 
// checks email
// if present generates otp and generates it  on a collections
// user gives otp and  if matches and then gives password and updates  the password 
// 