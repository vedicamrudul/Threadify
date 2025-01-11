const { StatusCodes } = require('http-status-codes');
const Notification=require('../models/notifications.model');
const User=require('../models/user.model')

const getNotfications=async (req,res)=>{
    const userId=req.user._id;
    const userExists=await User.findById(userId)
    if(!userExists) return res.status(StatusCodes.NOT_FOUND).json({"msg": "User not found"});

    const notifications=await Notification.find({"to": userId}).populate({
        path: "from",
        select: "username profileImg",
    });;

    await Notification.updateMany({"to": userId}, {"read": true})

    if(notifications.length==0) return res.status(StatusCodes.OK).json({"msg": "There are no new notifications"})
    res.status(StatusCodes.OK).json(notifications);
}

const deleteNotifications=async (req,res)=>{
    const userId=req.user._id;
    const userExists=await User.findById(userId)
    if(!userExists) return res.status(StatusCodes.NOT_FOUND).json({"msg": "User not found"});

    await Notification.deleteMany({"to": userId});
    res.status(StatusCodes.OK).json({"msg": "Notifications cleared"});
}

module.exports={
    deleteNotifications,
    getNotfications
}