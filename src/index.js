const express=require('express');
const app=express();
const userRouter=require('./routes/userRoutes');
const noteRouter=require('./routes/postRoutes');
const router=require('./routes/upload')




const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');


dotenv.config();
const PORT=process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
//convert re.body into json
app.use(express.json());
// app.use(bodyParser.json());

//Corsfor additional header
app.use(cors());


//router
app.use('/users',userRouter);
app.use('/posts',noteRouter);
app.use('/upload',router)

app.get('/',(req,res)=>{
res.send("Hello Worlds")}
);

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

app.listen(PORT,async ()=>{
  console.log("Port is Running on: ",PORT);

})


