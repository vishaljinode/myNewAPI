const express=require('express');
const postmodels=require('../models/postModels');
const userModels=require("../models/userModels");

const Post=postmodels.postsmodel;



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

  const deletedPost=await Post.findOneAndDelete({_id:postId})
  res.status(200).json({message:"Post Deleted Successfully",deletedPost})

} catch (error) {
  console.log(error);


}




}






module.exports={createPost,getPosts,getPostById,updatePost,deletePost}

