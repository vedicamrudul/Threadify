// havent finished signup function and also i havent made the util function of generatetokenandcookie so start with that tomorrow
const User=require('../models/user.model');
const bcrypt=require('bcrypt');
const generateTokenAndSetCookie=require('../lib/utils/generateTokenAndSetCookie');

const authcheck=async (req, res) => {
  // just a route to check the authorization middleware imo.
    res.send(req.user);
}

const signup = async (req, res) => {
      const { username, email, password, fullName } = req.body;
      // Validate email format
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid Email" });
      }
  
      // Check for existing username
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Check for existing email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      console.log(password.length)
      if(password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
      });
  
      // If user creation fails
      if (!newUser) {
        return res.status(400).json({ message: "Invalid User Data" });
      }
  
      // Generate token and set cookie
      generateTokenAndSetCookie(newUser._id, res);
  
      // Send response with user details
      res.status(201).json({
        message: "User Created Successfully",
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          followers: newUser.followers,
          following: newUser.following,
          profileImg: newUser.profileImg,
          coverImg: newUser.coverImg,
        },
      });
  };
 

const login=async (req, res) => {
    // login mai sabse pehele email and password lena rahega and then we must check if the email exists or not. If the email exists we take the password and compare it with the hasehd password using the function bcrypt.compare(password, hashedPassword) and if the password is correct we generate a token and set a cookie and send the user details back to the client.
    console.log("here")
    const {email, password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Invalid Email"});
    }
    const isPasswordCorrect=await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid Password"});
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
        message: "User Logged In Successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        }
    });
}

const logout = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 0, // Set the cookie to expire immediately
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports={
    signup,
    login,
    logout,
    authcheck
}