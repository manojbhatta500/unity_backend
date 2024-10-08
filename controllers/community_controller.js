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




module.exports = {
    createCommunity,
    createCommunityWithPicture
}