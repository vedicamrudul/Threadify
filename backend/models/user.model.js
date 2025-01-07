const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please Enter Username"],
        unique: true,
    },
    fullName:{
        type: String,
        required: [true, "Please Enter Full Name"],
    },
    password:{
        type: String,
        required: [true, "Please Enter Password"],
        minlength: 6,
    },
    email: {
        type: String,
        required:[true, "Please Enter Valid Email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,  "Please Enter Valid Email"],
        unique: true
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    profileImg:{
        type: String,
        default: ""
    },
    coverImg:{
        type: String,
        default: ""
    },
    bio:{
        type: String,
        default: ""
    },
    link:{
        type: String,
        default: ""
    }
    // cuz followers is an array of users
},{ timestamp:true});

module.exports=mongoose.model('User', userSchema);
