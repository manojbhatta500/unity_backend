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
    // await new Promise(resolve => setTimeout(resolve, 10000));
   return res.status(200).json(community);
}


async function editSingleCommunity(req,res) {
    console.log('edit single community is running');

    const communityId = req.params.id;

    console.log(`community id is ${communityId}`);


    const data = req.body;
    console.log(data);
    // maybe i should make middleware of it because i have to use it i guess let's see
    if(Object.keys(data).length ===0){
        return res.status(400).json({
            status: "error",
            message: "please send body."
        });
    }
    const updataedData = {};
    if(data.name){
        const communityNameExists =  await communityModel.findOne({
            name: data.name.trim()
        });
        if(communityNameExists){
            console.log(communityNameExists);
            return res.status(400).json({
                status: "error",
                message: "community name already exists. try another one"
            });
        }else{
            console.log('community  name does not exists');
            updataedData.name = data.name.trim();
        }
    }


    if(data.description){
        updataedData.description = data.description.trim();
    }
    if(data.community_type){
        updataedData.community_type = data.community_type.trim();
    }
    if(data.rules){
        updataedData.rules = data.rules.trim();
    }

    // for cover url we will make another api 

    const isModified = Object.keys(updataedData).length > 0;

    if(!isModified){
        return res.status(400).json({
          status: "error",
          message: "No changes were made.",
        });
    }



    const updatedCommunity = await communityModel.findOneAndUpdate(
        {_id: communityId},
        {$set: updataedData},
        {new:true}
    );

    
    if(updatedCommunity){
        console.log('User data updated successfully.');
        return res.status(200).json({
            status: "success",
            updatedData : updatedCommunity
        });
       
    }else{
        console.log(updataedData);
        return res.status(200).json({
            status: "error",
            message: "community is not updated.",
          });
    }   
}



module.exports = {
    createCommunity,
    createCommunityWithPicture,
    getAllAdimCommunity,
    fetchSingleCommunity,
    editSingleCommunity
}