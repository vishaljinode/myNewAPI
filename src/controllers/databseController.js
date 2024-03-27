const userModels= require('../models/userModels');
const UserAccount = userModels.users;


var DatabaseController = function (){

};


DatabaseController.prototype.checkUserExistsById = function (userId) {
    return UserAccount.findOne({ _id: userId })
        .then(userAccount => {
            if (!userAccount) {

                return { exists: false };
            }
   
            return userAccount;
        })
        .catch(error => {
          console.log(e)
        });
};


module.exports = DatabaseController;


