// for follow, comment and like.
const mongoose=require('mongoose');

const notificationSchema=new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        required:true,
        enim: ['like', 'comment', 'follow']
    },
    read:{
        type: Boolean,
        default:false
    }
})

module.exports=mongoose.model('Notification',notificationSchema);

