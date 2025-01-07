// havent finished signup function and also i havent made the util function of generatetokenandcookie so start with that tomorrow
const User=require('../models/user.model');
const bcrypt=require('bcryptjs');
const signup=async (req, res) => {
    const {username, email, password, fullName}=req.body;

    const emailRegex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!emailRegex.test(email)){
        return res.status(400).json({message: "Invalid Email"});
    }

    const existingUser=await User.findOne({username});;
    if(existingUser){
        return res.status(400).json({message: "Username already exists"});
    }

    const existingEmail=await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({message: "Email already exists"});
    }

    // hashing password.
    const salt=await bcrypt.genSaltSync(10);
    const hashedPassword=await bcrypt.hash(password, salt);
     
    try{
        const user=await User.create({
            username,
            email,
            password: hashedPassword,
            fullName
        });
        res.status(201).json({message: "User Created Successfully", user});
    }catch(error){
        res.status(500).json({message: "Server Error"});
    }

    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        })
    }else{
        res.status(400).json({message: "Invalid User Data"});
    }

};

const login=async (req, res) => {
    res.send('login route');
}

const logout=async (req, res) => {
    res.send('logout route');
}

module.exports={
    signup,
    login,
    logout
}