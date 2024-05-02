const userModels = require("../models/userModels");
const User = userModels.users;
const UserVerificationCode = userModels.userVerificationCode;
const { config } = require('../util/mailConfiguration')

// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECTRET_KEY = "myprojectapiforyou";
const sendEmail = require('../util/sendEmail');


//SingUp
const signUp = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is missing" });
  }
  if (!password) {
    return res.status(400).json({ error: "password is missing" });
  }
  if (!username) {
    return res.status(400).json({ error: "username is missing" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.status === "Active") {
        return res.status(400).json({ message: "User Already Exists" });
      }
      // If user exists but is inactive, update their credentials
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { email: email, password: password, username: username },
        { new: true }
      );
      console.log(updatedUser);
    } else {
      // Create a new user if none exists
      await User.create({ username, password, email });
    }

    const newUser = await User.findOne({ email }).select('_id email username status role');

    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10); // Generate a single random digit and add it to the OTP string
    }

    const updateUserVerificationCodePromise = UserVerificationCode.findOneAndUpdate(
      { email: newUser.email },
      { userId: newUser._id, otp: otp },
      { upsert: true, new: true }
    );

    const sendEmailPromise = sendEmail({
      email: newUser.email,
      subject: "Please verify OTP",
      message: `Your OTP is ${otp}`
    });

    await Promise.all([updateUserVerificationCodePromise, sendEmailPromise]);
    res.status(201).json({ status: true, User: newUser, message: `OTP sent on ${newUser.email}` })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
//Login
const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is missing" });
  }
  if (!password) {
    return res.status(400).json({ error: "password is missing" });
  }

  try {
    //Check User Exist or not
    const existingUser = await User.findOne({ email: email, status: "Active" });

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" })
    }

    //password match
    // const matchPassword=await bcrypt.compare(password,existingUser.password);
    if (password != existingUser.password) {
      return res.status(400).json({ message: "email or password not match" })
    }

    const signInuser = await User.findOne({ _id: existingUser._id }).select('email username');
    //token generation
    const token = await jwt.sign({ email: existingUser.email, id: existingUser._id }, SECTRET_KEY);

    res.status(200).json({ User: signInuser, Token: token })

  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }



}

const verifyUserOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the OTP entry for the given email
    const verificationEntry = await UserVerificationCode.findOne({ email });

    if (!verificationEntry) {
      return res.status(404).json({ message: "No OTP found. Please request a new one." });
    }

    // Check if the OTP matches
    if (verificationEntry.otp === otp) {

      await Promise.all([
        User.findOneAndUpdate({ email: email }, { $set: { status: "Active" } }),
        UserVerificationCode.deleteOne({ _id: verificationEntry._id })
      ]);
      return res.status(200).json({ message: "OTP verified successfully!" });
    } else {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "An error occurred during verification. Please try again later." });
  }
};

const forgotPass = async (req, res) => {
  if (!email) {
    return res.status(400).json({ error: "email is missing" });
  }
  try {



  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

}

module.exports = { signUp, signIn, verifyUserOtp }
