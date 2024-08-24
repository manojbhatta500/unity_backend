const express = require('express');

const router = express.Router();


const loginwithemail = router.get('/',(req,res)=>{
    console.log('jello world')
    res.json({
        'jellow':'world'
    });
});


module.exports = {
    loginwithemail
};