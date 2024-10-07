const communityModel = require('../models/community_model');

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
            desc: "all the feild are requireds"
        });
    }

    try{

        const alreadyTakenName = await communityModel.findOne({
            name: name
        });

        if(alreadyTakenName){
            return res.status(200).json({
                status : "error",
                desc : "please select another  community name."
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

        // const updatedCommunityDoc = await communityModel.findByIdAndUpdate(
        //     createCommunity._id,
        //     {$addToSet: {member_count: req.userid}},
        //     {new:true}
        // );

        // console.log("added admin to the current community");
        // console.log(updateCommunityMembers);
        
      return  res.status(200).json({
            status: "success",
            desc: "community creation is completed",
            data : createCommunity
        });

    }catch(e){
        console.log("catch statement ",e);
        return res.status(400).json({
            status: "error",
            desc: "something went wrong."
        });
    }
}


module.exports = {
    createCommunity
}