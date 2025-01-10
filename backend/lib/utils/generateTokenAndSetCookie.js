const jwt=require('jsonwebtoken');

const generateTokenAndSetCookie = (_id, res) => {
    const token=jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn:'15d'})

    res.cookie("jwt", token,{
        maxAge: 15*24*60*60*1000, //this is basically 15 days in milliseconds
        httpOnly: true, //this means that the cookie cannot be accessed by the browser
        sameSite: "strict", // CSRF attacks are prevented
        secure: process.env.NODE_ENV !== "development" //this is to ensure that the cookie is only sent over HTTPS in production
    })
}

module.exports=generateTokenAndSetCookie;