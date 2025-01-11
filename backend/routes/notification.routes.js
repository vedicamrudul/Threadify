const {deleteNotifications,getNotfications}= require('../controllers/notification.controller')
const authMiddleware=require('../middlewear/authMiddlewear')
const express=require('express');
const router=express.Router();

router.route('/').get(authMiddleware,getNotfications).delete(authMiddleware,deleteNotifications)

module.exports=router;