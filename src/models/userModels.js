const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  role: { type: String, default: "RegularUser", index: true },
  status : { type: String, default: "Active", index: true },
},{timestamps : true});

module.exports.users=mongoose.model("User",userSchema);
