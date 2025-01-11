const express=require('express');
const router=express.Router();

const {createPost,deletePost,commentOnPost,getUserPosts, getLikedPosts, getAllPosts, getFollowingPosts, likePost}=require('../controllers/post.controller');
const authMiddleware=require('../middlewear/authMiddlewear')

router.post('/create',authMiddleware, createPost);
router.post('/comment/:postId',authMiddleware, commentOnPost)
router.post('/likepost/:postId',authMiddleware, likePost)
router.get('/getuserposts/:userId', authMiddleware, getUserPosts)
router.get('/getallposts',authMiddleware,getAllPosts)
router.get('/getlikedposts/:userId',authMiddleware,getLikedPosts)
router.get('/getfollowingposts/:userId',authMiddleware,getFollowingPosts)
router.delete('/delete/:postId',authMiddleware, deletePost);

module.exports=router;