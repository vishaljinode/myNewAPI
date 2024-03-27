const express=require('express');
const postmodels=require('../models/postModels');
const userModels=require("../models/userModels");


const DatabaseController = require("./databseController");
var databaseController = new DatabaseController();



var PostController=function(){

}

const Post=postmodels.postsmodel;
const PostImage=postmodels.PostImage;
const PostComment=postmodels.PostComment;



const createPost=async(req,res)=>{
 const {title,description}=req.body;
 const userId=req.userId;
 try {
  // console.log("userId: ",userId);
  // console.log("title in controller: ",title);
  // console.log("description in controller: ",description);
   let newPost=new Post({
     title : title,
     description : description,
     userId : userId
   })
   await newPost.save();
   res.status(201).json(newPost);
 } catch (error){
  console.log(error)
 }
}
const getPosts=async(req,res)=>{
  const userId=req.userId;
  console.log("User ID in getPost",userId);

  try {
    let getPosts=await Post.find({userId:userId});

    let count=getPosts.length;

    res.status(200).json({length:count,post:getPosts});

  } catch (error) {
    console.log(error);
  }
}
const getPostById=async(req,res)=>{
 const postId=req.params.id;
 try {
  let postById=await Post.findOne({_id:postId});
  res.status(200).json(postById);
 } catch (error) {
  console.log(error);
 }
}
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
const deletePost=async(req,res)=>{
const postId=req.params.id;

try {

  const deletedPost = await Post.findOneAndUpdate(
    { _id: postId },
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

PostController.prototype.createPost1 = async function (postData, callback) {
  if (!postData) {
      debug("Failed to get postData");
      //callback(configuration.errorMessages.generic);
  }
  else {
      var post = new Post();      
      post.postLikes = [];
      post.save((error, createdPost) => {
          if (error) {
              debug("Error in createPost: " + error);
              callback("error occur in post creation", null);
          }
          else if (!createdPost) {
              debug("Error in createdPost: Failed to create a new post");
              callback("error occur in post creation", null);
          }
          else {

              if (postData.postedImages !== undefined) {
                  if (postData.postedImages.length > 0) {
                      debug("posted Images", postData.postedImages);

                      var postImages = [];
                      var count = 1;
                      for (var i = 0; i < postData.postedImages.length; i++) {
                          var postImage = new PostImage();
                          postImage.mediaUrl = postData.postedImages[i].mediaUrl;
                          postImage.mediaType = postData.postedImages[i].mediaType;
                          postImage.postId = createdPost._id;
                          postImage.save((error, createdPostImage) => {
                              if (error) {
                                  debug("Error in createdPostImage: " + error);
                                  callback("error occur in post creation", null);
                              }
                              else if (!createdPostImage) {
                                  debug("Error in createdPostImage: Failed to create a new post image");
                                  callback("error occur in post creation", null);
                              }
                              else {
                                  createdPost.postImages.push(createdPostImage._id);
                                  if(count == postData.postedImages.length) {
                                      createdPost.save((error, createdPostWithImages) => {
                                          if (error) {
                                              debug("Error in updatePostImage: " + error);
                                              callback("error occur in post creation", null);
                                          }
                                          else if (!createdPostWithImages) {
                                              debug("Error in updatePostImage: Failed to update a post Image");
                                              callback("error occur in post creation", null);
                                          }
                                      });
                                      
                                  }
                                  count++;

                              }
                          });
                      }

                  }
              }
             
              callback(null, createdPost);
          }
      })
  }
}







module.exports={createPost,getPosts,getPostById,updatePost,deletePost,PostController}

