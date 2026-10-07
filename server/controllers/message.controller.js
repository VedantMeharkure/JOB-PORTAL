const Message=require("../models/message");
const {getChatAccess}=require("../utils/chatAccess");
async function getMessages(req,res)
{
    const {applicationId}=req.params;
    const access = await getChatAccess(
        applicationId,
        req.user.id
    );
    if(!access.allowed)
    {
        return res.status(access.status).json({message:access.message});
    }
    const requestedLimit=parseInt(req.query.limit)||50;
    const limit = Math.min(
        Math.max(requestedLimit, 1),
        100
    );    
    const messages=await Message.find({application:applicationId})
        .sort({createdAt:-1})
        .limit(limit)
        .populate("sender","name role")
        .lean();
        messages.reverse();
    return res.status(200).json({messages});
}
module.exports={getMessages};