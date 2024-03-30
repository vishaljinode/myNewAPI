


const express=require('express');
const userRouter=express.Router();
const {signUp,signIn} = require("../controllers/userController")

userRouter.get('/',(req,res)=>{
res.send('hello user get');
})


//user Routes singUp singIn
userRouter.post('/signup',signUp);
userRouter.post('/signin',signIn);








  module.exports = userRouter;
