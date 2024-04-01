const express=require('express');
const postmodels=require('../models/postModels');
const userModels=require("../models/userModels");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const mongoose = require('mongoose');

const Post=postmodels.Post;
const PostImage=postmodels.PostImage;
const PostComment=postmodels.PostComment;

const UserAccount = userModels.users;


        
cloudinary.config({ 
  cloud_name: 'dhyq1xwix', 
  api_key: '191923522744623', 
  api_secret: 'FIEq8HyYSMDbm2S3-YDLEotJ8AU' 
});

//for user
const createPost=async(req,res)=>{
    
  const userId = req.userId; 
  const storage = multer.memoryStorage();
  let uploadMedia = multer({ storage: storage }).single('file');

  try {
      uploadMedia(req, res, async function (err) {
         
          if (err instanceof multer.MulterError) {
              return res.status(500).send(err.message);
          } else if (err) {
              return res.status(500).send(err.message);
          } else if (!req.file) {
              return res.status(400).send('Please select a file to upload');
          }

          try {
                  let newPost = new Post({
                  postTitle: req.body.postTitle,
                  postDescription: req.body.postDescription,
                  postedBy: userId,
                  postDist: req.body.postDist
              });

              await newPost.save();

              const file = req.file;
              const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
              const newPostedImage = new PostImage ({
                  mediaUrl: result.secure_url,
                  mediaType: result.format,
                  postId : newPost._id
              });
              await newPostedImage.save();
              newPost.postImages =newPostedImage._id 
              await newPost.save();


              res.status(201).json(newPost);

          } catch (uploadError) {
              return res.status(500).json({ error: uploadError.message });
          }
      });
  } catch (err) {
      // This is for catching multer setup errors
      res.status(500).send('An unexpected error occurred');
  }
}

//get All post of user
const getPosts=async(req,res)=>{
  const userId=req.userId;
  console.log("User ID in getPost",userId);

  try {
    let getPosts=await Post.find({postedBy:userId,status:"Active"})
    .populate('postImages','mediaUrl')
    .populate('postLikes.likedBy','username')
    .populate('postComments.commentBy','username')
    .populate('postComments.commentId','username')
    .populate('postBookmarks.bookmarkedBy','username')
    .populate('shareDetails.sharedBy','username')

    let count=getPosts.length;

    res.status(200).json({length:count,post:getPosts});

  } catch (error) {
    console.log(error);
  }
}


//get post by post Id
const getPostById=async(req,res)=>{
 const postId=req.params.id;
 try {
  let postById=await Post.findOne({_id:postId,status:"Active"})
  .populate('postImages','mediaUrl')
  .populate('postLikes.likedBy','username')
  .populate('postComments.commentBy','username')
  .populate('postComments.commentId','username')
  .populate('postBookmarks.bookmarkedBy','username')
  .populate('shareDetails.sharedBy','username')


 return res.status(200).json(postById);
 } catch (error) {
  console.log(error);
 }
}

//Update post by post Id
const updatePost=async(req,res)=>{
  const postId=req.params.id;
  const {title,description}=req.body;

  console.log("title :",title);
  console.log("description :",description);
  console.log("postId :",postId);




try{
  const updatedPost=await Post.findOneAndUpdate({_id:postId},{$set:{
    title : title,
    description : description
  }})

  res.status(200).json({message: "Data updated Successfully",updatedData:updatedPost})

}catch(error){
  console.log(error);

}
}


//delete post by post Id
const deletePost=async(req,res)=>{
const postId=req.params.id;

try {

  const deletedPost = await Post.findOneAndUpdate(
    { _id: postId,status:"Active"},
    { $set: { status: "Deleted" } },
    { new: true }
);

if (!deletedPost) {
    return res.status(404).json({ message: "Post not found" });
}

res.status(200).json({ message: "Post Deleted Successfully", deletedPost });


} catch (error) {
  console.log(error);


}




}

//like post by post Id
const likePost = async (req, res) => {
  const { postId } = req.body; // Getting the postId from the request body
  const userId = req.userId; // Assuming userId is already extracted/set from somewhere before this function is called

  let likeObj = {
    likedBy: userId, // Structure of the object to push into postLikes array
  };

  try {
    const currentPost = await Post.findOneAndUpdate(
      { _id: postId,status :"Active" }, // Filter document by postId
      { $push: { postLikes: likeObj } }, // Push likeObj into postLikes array
      { new: true } // Option to return the updated document
    );

    if (!currentPost) {
      return res.status(404).send('Post not found.');
    }

    // Send back the updated post document or a success message
    res.json({ success: true, message: 'Post liked successfully.', post: currentPost });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({ success: false, message: 'An error occurred while liking the post.', error: error.toString() });
  }
};

const unLikePost = async (req, res) => {
  const { postId } = req.body; // Getting the postId from the request body
  const userId = req.userId; // Assuming userId is already extracted/set from somewhere before this function is called


  try {
    const currentPost = await Post.findOneAndUpdate(
      { _id: postId,status :"Active" ,"postLikes.likedBy":userId}, // Filter document by postId
      { $pull: { postLikes: {likedBy:userId} } }, // Push likeObj into postLikes array
      { new: true } // Option to return the updated document
    );

    if (!currentPost) {
      return res.status(404).send('Post not found.');
    }

    // Send back the updated post document or a success message
    res.json({ success: true, message: 'Post unliked successfully.', post: currentPost });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({ success: false, message: 'An error occurred while unliking the post.', error: error.toString() });
  }
};

const savePost = async (req, res) => {
  const { postId } = req.body; // Getting the postId from the request body
  const userId = req.userId; // Assuming userId is already extracted/set from somewhere before this function is called

  let bookmarkObj = {
    bookmarkedBy: userId, // Structure of the object to push into postLikes array
  };

  try {
    const currentPost = await Post.findOneAndUpdate(
      { _id: postId,status:"Active"}, // Filter document by postId
      { $push: { postBookmarks: bookmarkObj } }, // Push likeObj into postLikes array
      { new: true } // Option to return the updated document
    );

    if (!currentPost) {
      return res.status(404).send('Post not found.');
    }

    // Send back the updated post document or a success message
    res.json({ success: true, message: 'Post saved successfully.', post: currentPost });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({ success: false, message: 'An error occurred while saving the post.', error: error.toString() });
  }
};

const unSavePost = async (req, res) => {
  const { postId } = req.body; // Getting the postId from the request body
  const userId = req.userId; // Assuming userId is already extracted/set from somewhere before this function is called


  try {
    const currentPost = await Post.findOneAndUpdate(
      {
        _id: postId, // Filter by postId
        status: "Active",
        "postBookmarks.bookmarkedBy": userId, // Further filter where user has bookmarked
      },
      { 
        $pull: { postBookmarks: { bookmarkedBy: userId } } // Remove the object from postBookmarks array where bookmarkedBy matches userId
      },
      { 
        new: true // Option to return the updated document
      }
    );
    

    if (!currentPost) {
      return res.status(404).send('Post not found.');
    }

    // Send back the updated post document or a success message
    res.json({ success: true, message: 'Post unsaved successfully.', post: currentPost });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({ success: false, message: 'An error occurred while un saving the post.', error: error.toString() });
  }
};


const commentPost = async(req, res) => {
  const { postId, comment } = req.body;
  const userId = req.userId;

  // Validation
  if (!postId || !comment) {
    return res.status(400).json({ success: false, message: 'Post ID and comment are required.' });
  }

  try {
    let newComment = new PostComment({
      comment: comment,
      postId: postId,
      commentedBy: userId,
    });

    await newComment.save();



    let commentObj = {
      commentBy: userId,
      commentId : newComment._id  // Structure of the object to push into postLikes array
    };
  


    //update Post
    await Post.findOneAndUpdate(
      { _id: postId }, // Filter document by postId
      { $push: { postComments:commentObj} }, // Push likeObj into postLikes array
      { new: true } // Option to return the updated document
    );

    res.status(201).json({ success: true, message: 'Comment added successfully.', data: newComment });
  
  } catch (error) {
    console.error('Error commenting on the post:', error); // Logging the error
    res.status(500).json({ success: false, message: 'An error occurred while commenting on the post.', error: error.toString() });
  }
}
const replyComment = async (req, res) => {
  const { commentId, comment } = req.body;
  const userId = req.userId;

  if (!commentId || !comment) {
    return res.status(400).json({ success: false, message: 'Comment ID and reply comment are required.' });
  }

  const replyObj = {
    comment: comment,
    commentedBy: userId,
  };

  try {
    const currentComment = await PostComment.findOneAndUpdate(
      { _id: commentId },
      { $push: { replyComment: replyObj } }, // Assuming 'replyComments' is the correct field name for replies
      { new: true} // Populate example (adjust according to your schema)
    );

    if (!currentComment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    res.json({ success: true, message: 'Reply added successfully.', comment: currentComment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while replying to the comment.', error: error.toString() });
  }
};

const deleteComment=async(req, res) => {
  const {commentId} = req.body;
  const userId = req.userId;

  // Validation
  if (!commentId) {
    return res.status(400).json({ success: false, message: 'Comment ID is required.' });
  }

  try {
    let deleteComment = await PostComment.findOneAndUpdate(
      { _id: commentId }, 
      { $set : { status :"Deleted", deletedBy : userId ,deletedOn : new Date()}}, // Push likeObj into postLikes array
      { new: true } 
    );

    res.status(201).json({ success: true, message: 'Comment deleted successfully.', data: deleteComment });
  
  } catch (error) {
    console.error('Error deleting comment:', error); // Logging the error
    res.status(500).json({ success: false, message: 'An error occurred while deleting comment.', error: error.toString() });
  }
}

const deleteCommentReply=async(req, res) => {
  const {replyCommentId} = req.body;
  const userId = req.userId;

  // Validation
  if (!replyCommentId) {
    return res.status(400).json({ success: false, message: 'Reply comment ID is required.' });
  }

  try {
    let deletedCommentReply = await PostComment.findOneAndUpdate(
      { "replyComment._id": replyCommentId }, 
      { $set : { "replyComment.$.status" :"Deleted", "replyComment.$.deletedBy" : userId }}, // Push likeObj into postLikes array
      { new: true } 
    );

    res.status(201).json({ success: true, message: 'CommentReply deleted successfully.', data: deletedCommentReply });
  
  } catch (error) {
    console.error('Error deleting comment reply:', error); // Logging the error
    res.status(500).json({ success: false, message: 'An error occurred while deleting comment reply.', error: error.toString() });
  }
}

const sharePost = async (req, res) => {
  const { postId } = req.body; // Getting the postId from the request body
  const userId = req.userId; // Assuming userId is already extracted/set from somewhere before this function is called

  let shareObj = {
    sharedBy: userId, // Structure of the object to push into postLikes array
  };

  try {
    const currentPost = await Post.findOneAndUpdate(
      { _id: postId,status :"Active" }, // Filter document by postId
      { $push: { shareDetails : shareObj } }, // Push likeObj into postLikes array
      { new: true } // Option to return the updated document
    );

    if (!currentPost) {
      return res.status(404).send('Post not found.');
    }

    // Send back the updated post document or a success message
    res.json({ success: true, message: 'Post share successfully.', post: currentPost });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({ success: false, message: 'An error occurred while sharing the post.', error: error.toString() });
  }
};




//###############For Admin#######
//User Summary
const usersummary = async (req, res) => {
  const adminId = req.userId;

  try {
    const reqByUser = await UserAccount.findOne({
      _id: adminId,
      role: "Admin",
      status: "Active",
    });

    if (!reqByUser) {
      return res
        .status(400)
        .json({ status: false, message: "Only Admin Can Access" });
    } else {
      const totalUser = await UserAccount.find();
      const totalUserId = totalUser.map((x) => x._id);

      const summaryPromises = totalUserId.map(async (id) => {
        const [
          myUsername,
          totalPost,
          totalPostComment,
          totalPostLike,
          totalPostSave,
          totalPostCommentReply,
          totalPostShare,
        ] = await Promise.all([
          UserAccount.findOne({ _id: id }).select("_id username email"),
          Post.find({ postedBy: id }),
          PostComment.find({ commentedBy: id }),
          Post.find({ "postLikes.likedBy": id }),
          Post.find({ "postBookmarks.bookmarkedBy": id }),
          PostComment.find({ "replyComment.commentedBy": id }),
          Post.find({ "shareDetails.sharedBy": id }),
        ]);

        const summaryObj = {
          userId: id,
          username: myUsername.username,
          userEmail: myUsername.email,
          userPostCount: totalPost.length,
          userPostCommentCount: totalPostComment.length,
          userPostLikeCount: totalPostLike.length,
          userPostSaveCount: totalPostSave.length,
          userPostCommentReplyCount: totalPostCommentReply.length,
          userPostShareCount: totalPostShare.length,
        };
        return summaryObj;
      });

      const summary = await Promise.all(summaryPromises);
      return res
        .status(200)
        .json({
          status: true,
          message: "User data retrieved successfully",
          userData: summary,
        });
    }
  } catch (error) {
    console.log(error);
  }
};

//User Summary Of current User
const summaryOfCurrentUser = async (req, res) => {
  const adminId = req.userId;

  try {
    const reqByUser = await UserAccount.findOne({
      _id: adminId,
      role: "Admin",
      status: "Active",
    });

    if (!reqByUser) {
      return res
        .status(400)
        .json({ status: false, message: "Only Admin Can Access" });
    } else {
      
      const totalUserId = [req.body.currentUserId]
      const summaryPromises = totalUserId.map(async (id) => {
        const [
          myUsername,
          totalPost,
          totalPostComment,
          totalPostLike,
          totalPostSave,
          totalPostCommentReply,
          totalPostShare,
        ] = await Promise.all([
          UserAccount.findOne({ _id: id }).select("_id username email"),
          Post.find({ postedBy: id }).populate('postImages','mediaUrl'),
          PostComment.find({ commentedBy: id }).populate({
            path: 'postId',
            populate: {
              path: 'postImages',
              model: PostImage // Use the PostImage model for populating the postImages field
            }
          }),
          Post.find({ "postLikes.likedBy": id }).select("_id postTitle postDescription postLikes status").populate('postImages','mediaUrl'),
          Post.find({ "postBookmarks.bookmarkedBy": id }).select("_id postTitle postBookmarks status").populate('postImages','mediaUrl'),
          PostComment.find({ "replyComment.commentedBy": id })
            .select("_id comment replyComment")
            .populate({
              path: 'postId',
              select: '_id postTitle postDescription',
              populate: {
                path: 'postImages',
                model: PostImage // Assuming 'PostImage' is the model name for post images
              }
            }),
          Post.find({ "shareDetails.sharedBy": id }).select("_id postTitle postDescription status").populate('postImages','mediaUrl'),
        ]);
      
        const summaryObj = {
          userId: id,
          username: myUsername.username,
          userEmail: myUsername.email,
          userPostCount: totalPost.length,
          userPostCommentCount: totalPostComment.length,
          userPostLikeCount: totalPostLike.length,
          userPostSaveCount: totalPostSave.length,
          userPostCommentReplyCount: totalPostCommentReply.length,
          userPostShareCount: totalPostShare.length,
          userPost: totalPost,
          userPostComment: totalPostComment,
          userPostLike: totalPostLike,
          userPostSave: totalPostSave,
          userPostCommentReply: totalPostCommentReply,
          userPostShare: totalPostShare,
        };
        return summaryObj;
      });
      
      const summary = await Promise.all(summaryPromises);
      return res.status(200).json({
        status: true,
        message: "User data retrieved successfully",
        userData: summary,
      });
    }
  } catch (error) {
    console.log(error);
  }
};


//Get Post Of User
const getPostByIdAdmin=async(req,res)=>{
  const postId=req.params.id;
  try {
   let postById=await Post.findOne({_id:postId})
   .populate('postImages','mediaUrl')
   .populate('postLikes.likedBy','username')
   .populate('postComments.commentBy','username')
   .populate('postComments.commentId','username')
   .populate('postBookmarks.bookmarkedBy','username')
   .populate('shareDetails.sharedBy','username')
   return res.status(200).json(postById);
  } catch (error) {
   console.log(error);
  }
 }




module.exports={
  getPostByIdAdmin,
  summaryOfCurrentUser,
  sharePost,
  usersummary,
  unLikePost,
  unSavePost,
  deleteCommentReply,
  replyComment,
  deleteComment,
  commentPost,
  savePost,
  likePost,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost}

