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
    //   await   new Promise(resolve => setTimeout(resolve, 5000));
        res.status(200).json({
            status: "success",
            user: {
                userName: foundUser.username,
                name: foundUser.name || null,
                address: foundUser.address || null,
                phoneNumber: foundUser.phone_number || null,
                bio: foundUser.bio || null,
                status: foundUser.status ,
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
async function editBasicUserData(req, res) {
    console.log('edit basic user data function called');

    // const data = {
    //     name: req.body.name?.trim(),
    //     bio: req.body.bio?.trim()
    // };
    const data = req.body;

    try {
        console.log('Attempting to find user with ID:', req.userid);
        const foundUser = await UserModel.findOne({ _id: req.userid });
        console.log('User found:', foundUser);

        if (!foundUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        // Log existing user data and incoming data
        console.log("Existing User Data:", foundUser);
        console.log("Incoming Data:", data);

        // Check if there are any changes
        const isModified = Object.keys(data).some(key => foundUser[key]?.trim() !== data[key]);

        if (!isModified) {
            console.log('No changes detected, responding with no changes.');
            return res.status(400).json({
                status: "error",
                message: "No changes were made."
            });
        }

        // Update user data if modifications are detected
        console.log('Updating user data...');
        const updatedUser = await UserModel.updateOne(
            { _id: req.userid },
            { $set: data }
        );
        
        console.log('Update result:', updatedUser);

        if (updatedUser.modifiedCount > 0) {
            console.log('User data updated successfully.');
            return res.status(200).json({
                status: "success",
                message: "User data updated successfully."
            });
        } else {
            console.log('No documents modified.');
            return res.status(400).json({
                status: "error",
                message: "No changes were made."
            });
        }

    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while editing user data."
        });
    }
}



module.exports = {
    getBasicUserData,
    editBasicUserData
}