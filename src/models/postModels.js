const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description : {
    type : String,
    required : true
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  }
},{timestamps : true});

module.exports.postsmodel=mongoose.model("Posts",userSchema);

