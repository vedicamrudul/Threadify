const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please Enter Title"],
    },
    img:{
        type: String,
        default: "no photo",
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    comments:[
        {
            text:
             {
                type:String,
                required: true
            },
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]},{timestamp:true});

module.exports=mongoose.model('Post', postSchema);