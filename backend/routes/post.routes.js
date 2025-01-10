const express=require('express');
const router=express.Router();

const {createPost,deletePost,commentOnPost}=require('../controllers/post.controller');
const authMiddleware=require('../middlewear/authMiddlewear')

router.post('/create',authMiddleware, createPost);
router.delete('/delete/:postId',authMiddleware, deletePost);
router.post('/comment/:postId',authMiddleware, commentOnPost);

module.exports=router;