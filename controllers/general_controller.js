const UserModel = require('../models/user_model'); 

async function getBasicUserData(req, res) {
    
    console.log('get Basic User data function run');
    console.log('the user id is ', req.userid);

    try {
        const foundUser = await UserModel.findOne({
            _id: req.userid  
        });
        if (!foundUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        res.status(200).json({
            status: "success",
            user: {
                userName: foundUser.username,
                status: foundUser.status,
                pPicture: foundUser.profile_picture_url || null
            } 
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching user data"
        });
    }
}




module.exports = {
    getBasicUserData
}