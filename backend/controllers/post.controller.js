const Post= require('../models/post.model');
const User=require('../models/user.model');
// crud- create, update, delete, get the posts. Apart from that we have comment on post, like/unlike post, get all posts by user, get all posts by following users, 

// whats left- notification on liking the post, or commenting (follow unfollow is already implemented.)
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

    const userExists=await User.findById(userId);
    if(!userExists) return res.status(StatusCodes.BAD_REQUEST).json({message: "User does not exist"});

    const post= await Post.findById(postId);
    if(!post) return res.status(StatusCodes.BAD_REQUEST).json({message: "Post does not exist"});

    if(!text) return res.status(StatusCodes.BAD_REQUEST).json({message: "Please Enter Comment"});

    await Post.findByIdAndUpdate(postId, { $push: { comments: { text, postedBy: userId } } });


    res.status(StatusCodes.OK).json({"msg": "commented successfully"})
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

// ab when we are working with an array of OBJECTS which has multiple fields within it, we will obviously have to mention the field we are working with. Other than that we can want to perform various operations like push pull etc but normal mai aisa nai hota right? so we have to mention kauna operation perform karna hai. and to clarity ki its array (warna usko lagega field name hai right? ) we use $push or $. toh it basically becomes (id, $push: {field: value}). toh we want to push this field and value aisa. 
    res.status(StatusCodes.OK).json({message: "Post Liked"});
   }

}
// lets finish getting posts of following people and get all the posts and get liked posts.

const getFollowingPosts=async(req,res)=>{
    const {userId}=req.params;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if(req.user._id != userId){ 
        return res.status(StatusCodes.UNAUTHORIZED).json({"msg": "You are not authroized to get these posts"})}
    
    const following=user.following;
    const result= await Post.find({postedBy: {$in: following}}).sort({createdBy: -1}).populate({path: "postedBy", select: "-password"}).populate({path: "comments.postedBy", select: "-password"});

    res.status(StatusCodes.OK).json(result)
}

const getLikedPosts=async (req,res)=>{
    const {userId}=req.params;
    console.log("one");

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("two");

    if(req.user._id != userId){ 
        return res.status(StatusCodes.UNAUTHORIZED).json({"msg": "You are not authroized to get these posts"})}
        console.log("three");

    const result=await Post.find({'_id': {$in: user.likedPosts }})
            .populate({
                path: "postedBy",
                select:"-password"
            })
            .populate({
                path: "comments.postedBy",
                select: "-password"
            });
    res.status(StatusCodes.OK).json(result)
}

const getAllPosts= async(req,res)=>{

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result= await Post.find()
    .populate({
        path: "postedBy",
        select: "-password"
    })
    .populate({
        path: "comments.postedBy",
        select: "-password"
    })

    res.status(StatusCodes.OK).json(result)
}

const getUserPosts = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: "User not found" });

        if(req.user._id != userId){ 
            return res.status(StatusCodes.UNAUTHORIZED).json({"msg": "You are not authroized to get these posts"})}
		const posts = await Post.find({ postedBy: userId })
			.sort({ createdAt: -1 }).populate({path: 'comments.postedBy', select:'-password'})
		

            /*
            POPULATE METHOD.
            => normally .populate('user') karte hai ya .populate('user', 'username') but since idhar array hai of users (for comments in every post) plus we want to deselct the password we are using this syntax. .populate({ path: "we give the path isme the field is comments which an array of objects that refer to userid named postedBy. so we pass comments.postedBy and delselect the password field."})
            */
           console.log(posts)

		res.status(200).json({user, posts });
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};



module.exports={
    createPost,
    deletePost,
    commentOnPost,
    likePost,
    getUserPosts,
    getFollowingPosts,
    getAllPosts,
    getLikedPosts
}