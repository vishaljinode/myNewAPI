const mongoose = require('mongoose');
const postSchema = mongoose.Schema({   
  postTitle: String, 
  postDescription: String,
  postDist : { type: mongoose.Schema.Types.String },   
  postImages: { type: mongoose.Schema.Types.ObjectId, ref: "PostImage" },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  postLikes: [{ likedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
  createdAt: { type: Date, default: Date.now }}],
  postComments: [   
    { commentId:{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment"},
      commentBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},       
    }
  ],
 
  postBookmarks:  [{ bookmarkedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true}, createdAt: { type: Date, default: Date.now } }],
  status: {type:String, default:"Active"},
  shareDetails: 
  [{ sharedBy :{type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},     
      sharedOn: { type: Date, default: Date.now } }],

  createdAt: { type: Date, default: Date.now }, 
  deletedOn: { type: Date , default: Date.now },
  deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
  updatedOn: { type: Date, default: Date.now  },
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
  comment: { type: mongoose.Schema.Types.String },
  commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  createdAt: { type: Date, default: Date.now },
  status: {type:String, default:"Active", index: true},
  replyComment:[{
      comment: { type: mongoose.Schema.Types.String },
      status: {type:String, default:"Active", index: true},
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
      createdAt: { type: Date, default: Date.now },
      deletedOn: { type: Date , default: Date.now  },
      deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
      updatedOn: { type: Date , default: Date.now  },
      updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  }],
  updatedOn: { type: Date, default: Date.now  },
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  deletedOn: { type: Date, default: Date.now  },
  deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},

})




module.exports.Post=mongoose.model("Post",postSchema);
module.exports.PostImage = mongoose.model("PostImage", postImageSchema);
module.exports.PostComment = mongoose.model("PostComment", postCommentSchema);


