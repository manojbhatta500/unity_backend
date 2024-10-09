const communityModel = require('../models/community_model');
const path = require('path');
const fs = require('fs'); 

async function createCommunity(req,res) {
    console.log('creating an community');
    const {
        name,
        desc,
        type,
        rules
    } = req.body;
    if(!name || !desc || !type || !rules){
        return res.status(400).json({
            status: "error",
            message: "all the feild are requireds"
        });
    }
    try{
        const alreadyTakenName = await communityModel.findOne({
            name: name
        });
        if(alreadyTakenName){
            return res.status(400).json({
                status : "error",
                message : "please select another  community name."
            });
        }
        const createCommunity = await communityModel.create({
            name: name ,
            description: desc,
            admin: req.userid,
            community_type: type,
            rules: rules,
            member_count:[req.userid]
        });
      return  res.status(200).json({
            status: "success",
            message: "community creation is completed",
        });
    }catch(e){
        console.log("catch statement ",e);
        return res.status(400).json({
            status: "error",
            message: "something went wrong."
        });
    }
}


async function createCommunityWithPicture(req,res) {
    const file = req.file; 
    const {
        name,
        desc,
        type,
        rules
    } = req.body;
    if(!name || !desc || !type || !rules){
        return res.status(400).json({
            status: "error",
            message: "all the feild are requireds"
        });
    }
    try{
        const imageUrl = path.join('uploads', file.filename);

        const alreadyTakenName = await communityModel.findOne({
            name: name
        });
        if(alreadyTakenName){
            return res.status(400).json({
                status : "error",
                message : "please select another  community name."
            });
        }
        const createCommunity = await communityModel.create({
            name: name ,
            description: desc,
            admin: req.userid,
            community_type: type,
            rules: rules,
            cover_url: imageUrl,
            member_count:[req.userid]
        });
      return  res.status(200).json({
            status: "success",
            message: "community creation is completed",
        });
    }catch(e){
        console.log("catch statement ",e);
        return res.status(400).json({
            status: "error",
            message: "something went wrong."
        });
    }

    
    
}



async function getAllAdimCommunity(req,res) {
    console.log('this is get all admin community function running');
    console.log(req.userid);

    const communities = await communityModel.find({
        admin: req.userid
    });
    if(!communities){
        return res.status(200).json({
            status: "error",
            message : "you are not admin of any community",
        });
    }
    //set admin feature
    // if list is empty then show one state 
    // if list is not empty then show and make inside the function and other 

        //   await new Promise(resolve => setTimeout(resolve, 3000));

    return res.status(200).json({
        status: "success",
        msg : "all the communities are fetched",
        com: communities
    });  
}

async function fetchSingleCommunity(req,res) {
    console.log('single community  fetched');
    const id = req.params.id;
    console.log('id is ',id);
    const community = await communityModel.findById(id);
    if(!community){
        return res.status(400).json({
            status: "error",
            message: "no community found  with this id"
        });
    }
    console.log('found community now sending it');
   return res.status(200).json(community);
}




module.exports = {
    createCommunity,
    createCommunityWithPicture,
    getAllAdimCommunity,
    fetchSingleCommunity
}