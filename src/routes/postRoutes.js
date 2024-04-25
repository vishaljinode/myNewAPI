



const express=require('express');
const noteRouter=express.Router();
const {summaryOfCurrentUser,sharePost,usersummary,unLikePost,
        unSavePost,deleteCommentReply,deleteComment,replyComment,
        commentPost,savePost,likePost,createPost,getPosts,getPostById,getAllPosts,
        updatePost,deletePost,getPostByIdAdmin}=require('../controllers/postController');
const auth=require('../middleware/auth')
const postmodels=require('../models/postModels');

const Post=postmodels.Post;
const PostImage=postmodels.PostImage;
const PostComment=postmodels.PostComment;



noteRouter.post('/add',auth,createPost);
noteRouter.get('/getPosts',auth,getPosts);
noteRouter.get('/getAllPosts',auth,getAllPosts);
noteRouter.get('/getPostById/:id',auth,getPostById);
noteRouter.put('/updatePost/:id',auth,updatePost);
noteRouter.get('/deletePost/:id',auth,deletePost);

noteRouter.post('/likePost',auth,likePost);
noteRouter.post('/unlikePost',auth,unLikePost);


noteRouter.post('/savePost',auth,savePost);
noteRouter.post('/unsavePost',auth,unSavePost);

noteRouter.post('/sharepost',auth,sharePost);


noteRouter.post('/commentPost',auth,commentPost);
noteRouter.post('/replyComment',auth,replyComment);

noteRouter.post('/deleteComment',auth,deleteComment);
noteRouter.post('/deleteCommentReply',auth,deleteCommentReply);


noteRouter.post('/usersummary',auth,usersummary)
noteRouter.post('/summaryOfCurrentUser',auth,summaryOfCurrentUser)

noteRouter.get('/getPostByIdAdmin/:id',auth,getPostByIdAdmin);






noteRouter.get('/add', (req, res) => { 
        res.send("Hello this is add")
        });




module.exports=noteRouter;






//  Post comment and reply
// postRouter.post('/post/comment/add', auth, (req, res) => {
//     if (!req.body.postId) {
//       return res.status(400).json({ error: "invalid post id." });
//     }
//     if (!req.body.comment || req.body.comment.length == 0) {
//       return res.status(400).json({ error: "invalid comment." });
//     }
//     app.postController.checkPostExistsById(req.body.postId, function (error, existedPost) {
     
//       // console.log("existedPost ", existedPost)
//       if (error) {
//         res.json({ error: error });
//       }
//       else if (existedPost.exists == false) {
//         return res.status(400).json({ error: "invalid post id." });
//       }
//       else if(existedPost.commentAllowed == false) {
//         return res.status(400).json({ error: "comments are not allowed on this post." });
//       }
//       else {
//         var postCommentJson = {
//           postId: req.body.postId,
//           comment: req.body.comment,
//           commentedBy: req.user.user_id
//         };
//         app.postController.createPostComment(postCommentJson, function (error, createdPostComment) {
//           if (error || !createdPostComment) {
//             return res.status(500).json({ error: error });
//           }
//           else {
  
//             debug(req.user);
//             return res.status(200).json({ status: "true", message: "Post Comment Created", data: [helpers.getPostCommentObject(createdPostComment,req.user)] });
  
//           }
//         });
//       }
//     });
  
//   });
  
//   postRouter.post('/post/comment/addReply', auth, (req, res) => {
//     if (!req.body.commentId) {
//       return res.status(400).json({ error: "invalid comment id." });
//     }
//     if (!req.body.comment || req.body.comment.length == 0) {
//       return res.status(400).json({ error: "invalid comment." });
//     }
//     app.postController.checkPostCommentExistsById(req.body.commentId, function (error, existedPostComment) {
//       if (error) {
//         res.json({ error: error });
//       }
//       if (existedPostComment.exists == false) {
//         return res.status(400).json({ error: "invalid comment id." });
//       }
//       else {
//         var postCommentReplyJson = {
//           commentId: req.body.commentId,
//           comment: req.body.comment,
//           commentedBy: req.user.user_id
//         };
//         app.postController.createPostCommentReply(existedPostComment, postCommentReplyJson, function (error, createdPostCommentReply) {
//           if (error || !createdPostCommentReply) {
//             return res.status(500).json({ error: error });
//           }
//           else {
            
//             app.postController.getPostComment(existedPostComment.postId, function (error, postComments) {
//               if (error) {
//                 res.status(400).json({ error: error });
//               }
//               else {
//                 var comments = [];                
//                 comments = postComments;
//                 let message = "Post Comment Reply Created";
//                 if(comments.length == 0){
//                   message = "Post Comment Reply not Created";
//                 }
  
  
//                 return res.status(200).json({ status: "true", message: message, data: comments });
//               }
//         });
//           }
//         });
//       }
//   });
//   });
  
