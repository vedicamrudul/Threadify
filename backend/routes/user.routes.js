const {getUserProfile, followUnfollowUser, suggestedUsers, updateProfile}=require('../controllers/user.controller')
const authMiddleware=require('../middlewear/authMiddlewear')

const express=require('express');
const router=express.Router();

router.route('/getuserprofile').get(authMiddleware,getUserProfile);
router.route('/followunfollow/:id').patch(authMiddleware,followUnfollowUser);
router.route('/suggested').get(authMiddleware,suggestedUsers);
router.route('/updateprofile').patch(authMiddleware,updateProfile);

module.exports=router;