const express=require('express');
const app=express();
const userRouter=require('./routes/userRoutes');
const noteRouter=require('./routes/postRoutes');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');

dotenv.config();
const PORT=process.env.PORT || 5000;

//convert re.body into json
app.use(express.json());

//Corsfor additional header
app.use(cors());


//router
app.use('/users',userRouter);
app.use('/posts',noteRouter);



if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log("Database Connected Successfully");
})
.catch((e)=>{
  console.log("Error in connection : ",e);
})



app.listen(PORT,()=>{
  console.log("Port is Running on: ",PORT);

})


