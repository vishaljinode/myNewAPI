const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    default: "RegularUser", 
    index: true 
  },
  status: { 
    type: String, 
    default: "Inactive", 
    index: true 
  },
}, { timestamps: true });

const userVerificationCodeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    index: true 
  },
  email: { 
    type: String, 
    required: true
  },
  otp: { 
    type: String 
  }
}, { timestamps: true });



const forgotPassVerificationCodeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    index: true 
  },
  email: { 
    type: String, 
    required: true
  },
  otp: { 
    type: String 
  }
}, { timestamps: true });
// Correct way to create and export the models
module.exports.users = mongoose.model("User", userSchema);
module.exports.forgotPassVerificationCode = mongoose.model("ForgotPasswordVerificationCode", forgotPassVerificationCodeSchema);
module.exports.userVerificationCode = mongoose.model("UserVerificationCode", userVerificationCodeSchema);