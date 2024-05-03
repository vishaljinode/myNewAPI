


const express=require('express');
const userRouter=express.Router();
const {signUp,signIn,verifyUserOtp,forgotPass,verifyForgotPassOtp,resetPassword} = require("../controllers/userController")
const auth = require('../middleware/auth');
userRouter.get('/',(req,res)=>{
res.send('hello user get');
})


//user Routes singUp singIn
userRouter.post('/signup',signUp);
userRouter.post('/signin',signIn);
userRouter.post('/verifyUserOTP',verifyUserOtp)
userRouter.post('/forgotPassOTP',forgotPass)
userRouter.post('/verifyForgotPass',verifyForgotPassOtp)
userRouter.put('/resetPassword',auth,resetPassword)


  module.exports = userRouter;
