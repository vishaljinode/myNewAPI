const express=require('express');
const noteRouter=express.Router();
const {createPost,getPosts,getPostById,updatePost,deletePost}=require('../controllers/postController');
const auth=require('../middleware/auth')

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
        
cloudinary.config({ 
  cloud_name: 'dhyq1xwix', 
  api_key: '191923522744623', 
  api_secret: 'FIEq8HyYSMDbm2S3-YDLEotJ8AU' 
});

const DatabaseController = require("../controllers/databseController");
var databaseController = new DatabaseController();

const postController =require('../controllers/postController');



noteRouter.post('/createPost',auth,createPost);
noteRouter.get('/getPosts',auth,getPosts);
noteRouter.get('/getPostById/:id',auth,getPostById);
noteRouter.put('/updatePost/:id',auth,updatePost);
noteRouter.get('/deletePost/:id',auth,deletePost);



noteRouter.post('/add/',(req, res) => { 
    const userId=req.userId;

    const storage = multer.memoryStorage();
    let uploadMedia = multer({storage: storage }).array('files');

    databaseController.checkUserExistsById(userId, function (error, existedUser) {
        if (error) {
            return res.status(500).json({ error: error });
        }
        if (!existedUser.exists) {
            return res.status(400).json({ error: "Invalid user id." });
        }

        // Handle media upload
        uploadMedia(req, res, async function (err) {
            if (req.fileValidationError) {
                return res.status(400).send(req.fileValidationError);
            }
            else if (!req.files || req.files.length === 0) {
                return res.status(400).send('Please select a file to upload');
            }
            else if (err instanceof multer.MulterError) {
                return res.status(500).send(err);
            }
            else if (err) {
                return res.status(500).send(err);
            }

            const files = req.files;
            const postedImages = [];

            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.buffer);
    
                postedImages.push({
                    mediaUrl: result.secure_url,
                    mediaType: result.format
                });
            }
            // Prepare post data
            const postJson = { 
                postId: req.body.postId,               
                postedImages, 
                postTitle: req.body.postTitle,
                postDescription: req.body.postDescription, 
                postedBy: userId, 
                postDist : req.body.postDist
            };
            postController.createPost1(postJson,function(error,createdPost){
                if(error){
                    return res.status(500).json({error:error})
                }

                if(!createPost){
                    return res.status(500).json({error:error})
                }

                return res.status(200).json({status: true,message:"Post Created Successfully"})
            })
           
          
             
            });
        });
    });

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
  
