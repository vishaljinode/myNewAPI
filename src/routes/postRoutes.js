const express=require('express');
const noteRouter=express.Router();
const {createPost,getPosts,getPostById,updatePost,deletePost}=require('../controllers/postController');
const auth=require('../middleware/auth')

noteRouter.post('/createPost',auth,createPost);
noteRouter.get('/getPosts',auth,getPosts);
noteRouter.get('/getPostById/:id',auth,getPostById);
noteRouter.put('/updatePost/:id',auth,updatePost);
noteRouter.delete('/deletePost/:id',auth,deletePost);


module.exports=noteRouter;
