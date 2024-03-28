const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
        
cloudinary.config({ 
  cloud_name: 'dhyq1xwix', 
  api_key: '191923522744623', 
  api_secret: 'FIEq8HyYSMDbm2S3-YDLEotJ8AU' 
});

const storage = multer.diskStorage({
    filename: function (req,file,cb) {
      cb(null, file.originalname)
    }
  });
  
  const upload = multer({storage: storage});



  router.post('/upload', upload.single('image'), function (req, res) {
    cloudinary.uploader.upload(req.file.path, function (err, result){
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error"
        })
      }
  
      res.status(200).json({
        success: true,
        message:"Uploaded!",
        data: result
      })
    })
  });
  router.get('/upload', upload.single('image'), function (req, res) {
res.send('upload get')    
});
  module.exports = router;
