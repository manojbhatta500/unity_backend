const UserModel = require('../models/user_model'); 
const path = require('path');
const fs = require('fs'); 



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
  
    const data = req.body;
  
    console.log('body data is:');
    console.log(data);
  
    try {
      console.log('Attempting to find user with ID:', req.userid);
      const foundUser = await UserModel.findOne({ _id: req.userid });
      console.log('User found:', foundUser);
  
      if (!foundUser) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
  
      // Create an update object to store changes
      const updateData = {};
  
      // Check and update the username
      if (data.username) {
        if (data.username.trim() !== foundUser.username.trim()) {
          // Check if the new username is already taken by another user
          const usernameTaken = await UserModel.findOne({ username: data.username.trim() });
          if (usernameTaken) {
            return res.status(400).json({
              status: "error",
              message: "Username already taken. Try another username.",
            });
          }
  
          updateData.username = data.username.trim();
        }
      }
  
      // Update other fields based on user input
      if (data.name) {
        updateData.name = data.name;
      }
      if (data.address) {
        updateData.address = data.address;
      }
      if (data.phone_number) {
        updateData.phone_number = data.phone_number;
      }
      if (data.bio) {
        updateData.bio = data.bio;
      }
  
      // Check if there are any changes
      const isModified = Object.keys(updateData).length > 0;
  
      if (!isModified) {
        console.log('No changes detected, responding with no changes.');
        return res.status(400).json({
          status: "error",
          message: "No changes were made.",
        });
      }
  
      // Update user data with specific fields
      const updatedUser = await UserModel.updateOne(
        { _id: req.userid },
        { $set: updateData }
      );
  
      console.log('Update result:', updatedUser);
  
      if (updatedUser.modifiedCount > 0) {
        console.log('User data updated successfully.');
        return res.status(200).json({
          status: "success",
          message: "User data updated successfully.",
        });
      } else {
        console.log('No documents modified.');
        return res.status(400).json({
          status: "error",
          message: "No changes were made.",
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while editing user data.",
      });
    }
  }




async function changeProfilePicture(req, res) {
  console.log('change profile picture function is called');
  console.log('req id is ' + req.userid);

  const file = req.file; 
  if (!file) {
    return res.status(400).json({
      status: "error",
      message: "Image is required."
    });
  }

  try {
    const foundUser = await UserModel.findOne({ _id: req.userid });
    console.log('User found:', foundUser);
    console.log('the set profile picture is ' + foundUser.profile_picture_url);

    if (foundUser.profile_picture_url) {
      // Profile picture exists, delete the old one
      const oldImagePath = path.join(__dirname, '..', foundUser.profile_picture_url);
      console.log('Deleting old profile picture:', oldImagePath);

      // Check if the file exists before attempting to delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old file
        console.log('Old profile picture deleted successfully.');
      } else {
        console.log('Old profile picture not found, skipping deletion.');
      }
    }

    // Save the new profile picture URL
    const newImageUrl = path.join('uploads', file.filename);
    foundUser.profile_picture_url = newImageUrl;

    // Save the user data with updated profile picture
    await foundUser.save();

    return res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully.",
      desc: foundUser
    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating profile picture."
    });
  }
}

  







module.exports = {
    getBasicUserData,
    editBasicUserData,
    changeProfilePicture
}