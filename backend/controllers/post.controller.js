const Post= require('../models/post.model');
const User=require('../models/user.model');
// crud- create, update, delete, get the posts. Apart from that we have comment on post, like/unlike post, get all posts by user, get all posts by following users, 

const {v2: cloudinary} = require('cloudinary');
const {StatusCodes}=require('http-status-codes');

const createPost= async (req, res)=>{
    const {title, img}=req.body;
    const userId=req.user._id;
    const userExists=User.findById(userId);
    if(!userExists){
        return res.status(400).json({message: "User does not exist"});
    };

    if(!title && !img){
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Please Enter Title or Image"});
    }

    await Post.create({title, img, postedBy: userId});
    res.status(201).json({message: "Post Created"});
}

const deletePost= async (req, res)=>{
    const {postId}=req.params;
    const userId=req.user._id;
    const userExists=User.findById(userId);
    if(!userExists){
        return res.status(400).json({message: "User does not exist"});
    };

    const post= await Post.findById(postId);
    if(!post){
        return res.status(400).json({message: "Post does not exist"});
    }

    if(post.postedBy.toString()!== userId.toString()){
        return res.status(401).json({message: "You are not authorized to delete this post"});
    }

    if(post.img){
        // delete image from cloudinary
        const publicId=post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({message: "Post Deleted"});
}

const commentOnPost= async (req, res)=>{
    // so the comment route might have a params postId in it. the comment is an array with objects having text and postedBy fields.
    const {postId}=req.params;
    const {text}=req.body;
    const userId=req.user._id;

    const userExists=User.findById(userId);
    if(!userExists) res.status(StatusCodes.BAD_REQUEST).json({message: "User does not exist"});

    const post= await Post.findById(postId);
    if(!post) res.status(StatusCodes.BAD_REQUEST).json({message: "Post does not exist"});

    if(!text) res.status(StatusCodes.BAD_REQUEST).json({message: "Please Enter Comment"});

    post.comments.push({text, postedBy: userId});
    // we use push to add anything to an array in mongoose
}

// we can later implement a controller for deleting comment as well, once the frontend is made ig.

const likePost= async (req, res)=>{
    const {postId}=req.params;
    const userId=req.user._id;

    const post= await Post.findById(postId);
    if(!post) res.status(StatusCodes.BAD_REQUEST).json({message: "Post does not exist"});

   if(post.likes.includes(userId)){
    await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}});
    await User.findByIdAndUpdate(userId, {$pull: {likedPosts: postId}});
    res.status(StatusCodes.OK).json({message: "Post Unliked"});
   }else{
   await Post.findByIdAndUpdate(postId, {$push: {likes: userId}});
   await User.findByIdAndUpdate(userId, {$push: {likedPosts: postId}});
//    okay so i am not able to remember the syntax for updating array as its kinda new for me. So lets think about it this way. normally agar kuch update karna reheta hai jaise name so we would just pass the id and then the new name like ({id, name: "new name"}). 

// ab when we are working with an array of OBJECTS which has multiple fields within it, we will obviously have to mention the field we are working with. Other than that we can want to perform various operations like push pull etc but normal mai aisa nai hota right? so we have to mention kauna operation perform karna hai. and to clarity ki its array (warna usko lagega field name hai right? ) we use $push or $. toh it basically becomes ({id, $push: {field: value}}). toh we want to push this field and value aisa. 
    res.status(StatusCodes.OK).json({message: "Post Liked"});
   }

}

const getAllPostsByUser= async (req, res)=>{
    const UserId=req.user._id;
}

module.exports={
    createPost,
    deletePost,
    commentOnPost,
    likePost
}