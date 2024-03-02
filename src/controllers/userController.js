const userModels = require("../models/userModels");
const User = userModels.users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECTRET_KEY =process.env.SECTRET_KEY;


//SingUp
const signUp = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findOne({ email: email })
    //check userAlready exist?
    if (existingUser) {
      return  res.status(400).json({ message: "User Already Exist" })
     }

    //Generate hashed password
    const hashedpassword = await bcrypt.hash(password, 10);

    //Create new User
    const newUser = await User.create({
      username: username,
      password: hashedpassword,
      email: email
    })

    //token genaration
    const token = await jwt.sign({ email: newUser.email, id: newUser._id }, SECTRET_KEY);
    res.status(201).json({ User: newUser, Token: token })

  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}

//Login
const signIn = async(req,res)=>{


  const {email,username,password}=req.body;

  try {

    //Check User Exist or not
    const existingUser=await User.findOne({email});
    if(!existingUser){
      return res.status(404).json({message:"User Not Found"})
    }

    //password match
    const matchPassword=await bcrypt.compare(password,existingUser.password);
    if(!matchPassword){
      return res.status(400).json({message:"email or password not match"})
    }

    //token generation
    const token=await jwt.sign({email:existingUser.email,id:existingUser._id},SECTRET_KEY);
    res.status(200).json({User:existingUser,Token:token})

  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }



}
module.exports = { signUp,signIn }
