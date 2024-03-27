const mongoose = require('mongoose');
const postSchema = mongoose.Schema({  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: String,
  description: String,   
  createdAt: { type: Date, default: Date.now },   
  postImages: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostImage" }],
  postLikes: [{ likedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, createdAt: { type: Date, default: Date.now }}],
  postComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment", index: true }],
  postBookmarks:  [{ bookmarkedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true}, createdAt: { type: Date, default: Date.now } }],
  status: {type:String, default:"Active"},
  shareDetails: {
      originalPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", index: true },
      sharedOn: { type: Date },
      sharedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true}
  },
  deletedOn: { type: Date },
  deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
  updatedOn: { type: Date },
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
},{timestamps : true});


//Post image schema
var postImageSchema = mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" , index: true},
  mediaUrl: String,
  mediaType: String,
  status: {type:String, default:"Active"},
  createdAt: { type: Date, default: Date.now }
});



//post comment schema
var postCommentSchema = mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", index: true },
  postDist : { type: mongoose.Schema.Types.String },
  comment: { type: mongoose.Schema.Types.String },
  commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  createdAt: { type: Date, default: Date.now },
  status: {type:String, default:"Active", index: true},
  replyComment:[{
      comment: { type: mongoose.Schema.Types.String },
      status: {type:String, default:"Active", index: true},
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
      createdAt: { type: Date, default: Date.now },
      deletedOn: { type: Date },
      deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
      updatedOn: { type: Date },
      updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  }],
  updatedOn: { type: Date },
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  deletedOn: { type: Date },
  deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},

})




module.exports.postsmodel=mongoose.model("Post",postSchema);
module.exports.PostImage = mongoose.model("PostImage", postImageSchema);
module.exports.PostComment = mongoose.model("PostComment", postCommentSchema);


