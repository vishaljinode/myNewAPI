const userModels= require('../models/userModels');
const UserAccount = userModels.users;


var DatabaseController = function (){

};


DatabaseController.prototype.checkUserExistsById = function (userId, callback) {
    UserAccount.findOne({ _id: userId }, function (error, userAccount) {
        if (error) {
            debug("Error in checkUserExistsById: " + error);
            callback(configuration.errorMessages.generic, null);
        }
        else if (!userAccount) {
            debug("checkUserExistsById returned no result");
            callback(null, { exists: false });
        }
        else {
            debug("checkUserExistsById returned a user");
            callback(null, userAccount);
        }
    });
}

module.exports = DatabaseController;




//app.js--------->

//PELA IMPORT 
// DatabaseController = require("./databaseController")


//PACHI NE EXPORT
// var databaseController = new DatabaseController();
// exports.databaseController = databaseController;







//POSTROUTES----->

//postRouter.post('/post/add/', auth, (req, res) => { 
// var userId = req.user.user_id;
// let uploadMedia = multer({ storage: helpers.mediaStorage, fileFilter: validator.postMediaFilter }).array('files');
// // console.log(req.files)
// app.databaseController.checkUserExistsById(userId, function (error, existedUser) {
//   if (error) {
//     res.json({ error: error });
//   }
//   if (existedUser.exists == false) {
//     return res.status(400).json({ error: "invalid user id." });
//   }
//   else {
//     uploadMedia(req, res, function (err) {
//       // console.log(req.files)
//       if(req.body.type != "TextPosting" && req.body.type != "Advertorial" && req.body.type != "ImagePosting" && req.body.type != "VideoPosting" 
//       ){
//         return res.status(400).json({ error: "type should be TextPosting or Advertorial or ImagePosting or VideoPosting happen" });
//       }
//       if(req.body.type == "TextPosting" && !req.body.postDescription){
//         return res.status(400).json({ error: "in TextPosting post type, postDescription is mandatory" });
//       }
//       if(req.body.type == "Advertorial" && !req.body.postDescription){
//         return res.status(400).json({ error: "in Advertorial post type, postDescription is mandatory" });
//       }
//       if(req.body.type == "ImagePosting" && req.files.length == 0){
//         return res.status(400).json({ error: "in ImagePosting post type, Image is mandatory" });
//       }
//       if(req.body.type == "VideoPosting" && req.files.length == 0){
//         return res.status(400).json({ error: "in VideoPosting post type, Video is mandatory" });
//       }
//       // req.file contains information of uploaded file
//       // req.body contains information of text fields, if there were any
//       if (req.fileValidationError) {
//         return res.send(req.fileValidationError);
//       }
//       else if (!req.files) {
//         return res.send('Please select a file to upload');
//       }
//       else if (err instanceof multer.MulterError) {
//         return res.send(err);
//       }
//       else if (err) {
//         return res.send(err);
//       }
//       let result = '';
//       const files = req.files;
//       let index, len;
//       var postedImage = { mediaUrl: '', mediaType: '' };
//       var postedImages = [];
//       var postJson = { postId: req.body.postId, }
//       // Loop through all the uploaded images and display them on frontend
//       //for (index = 0, len = files.length; index < len; ++index) {
//       for(index = 0; index < files.length; index++) {
//         if((req.body.type == "ImagePosting") && (files[index].mimetype !== "image/png" && files[index].mimetype !== "image/jpeg") ){
//           return res.status(400).json({ error: "in ImagePosting type, can't upload video" });
//         }
//         if((req.body.type == "VideoPosting") &&  (files[index].mimetype == "image/png" || files[index].mimetype == "image/jpeg" || files[index].mimetype == "image/jpg") ){
//           return res.status(400).json({ error: "in ImagePosting type, can't upload image" });
//         }
//         postedImage.mediaUrl = path.join(__dirname, files[index].path);
//         postedImage.mediaType = files[index].mimetype;
//         postedImages.push({ mediaUrl: path.join(__dirname, files[index].path), mediaType: files[index].mimetype });
//         result += path.join(__dirname, files[index].path);
//       }
//       // console.log(postedImages);
//       let coordinates = req.body.latitude +  ","+  req.body.longitude
//       geocoder.reverseGeocode(coordinates, function(error, data) {
//         // console.log(error);
//         // console.log(data.results[0].formatted_address);
//         // console.log(data.results[0].place_id);
//         let postalCode
//         for(let i=0; i<data.results.length; i++){
//           for(let j=0; j<data.results[i].address_components.length; j++){
//             if(data.results[i].address_components[j].types.includes('postal_code')){
//               postalCode = data.results[i].address_components[j].long_name;
//               break;
//             } 
//           }
//         }
//         // console.log(postalCode)
//         var postJson = { 
//           postId: req.body.postId, 
//           partnerId: req.body.partnerId, 
//           postedImages, 
//           hashTags: req.body.hashTags, 
//           postTitle: req.body.postTitle,
//           postDescription: req.body.postDescription, 
//           postedBy: userId, 
//           latitude: req.body.latitude, 
//           longitude: req.body.longitude,
//           isAdvertorialPost: req.body.isAdvertorialPost, 
//           dataPrivacyRule: req.body.dataPrivacyRule, 
//           category: req.body.category,
//           fontColor: req.body.fontColor || '', 
//           backgroundColor: req.body.bgColor || '', 
//           type: req.body.type || '',
//           address: data.results[0].formatted_address || '',
//           placeId: data.results[0].place_id || '',
//           commentAllowed: req.body.commentAllowed || true,
//           zipCode: postalCode || ''
//       };
//         app.postController.createPost(postJson, function (error, createdPost) {
//           if (error || !createdPost) {
//             return res.status(500).json({ error: error });
//           }
//           else {
//             let contentObj = {
//               contentId : createdPost._id,
//               contentType : "Post",
//               contentSubType : req.body.type,
//             }
//             app.postController.createContent(contentObj, function (error, createdPostContent) {
//               if (error || !createdPostContent) {
//                 return res.status(500).json({ error: error });
//               }
//               else {
//                 return getPostById(createdPost._id, req.user.user_id, "Post Created", res,"true");
//               }
//             })
//           }
//         })
//       })               
//     });
//   }
// });

// });