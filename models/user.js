const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({

   
    email : {  type : String   },
    password : {  type : String   },

    wishlist: [{
        itemID: {type: String},
        itemName: {type: String},
        mainCategory : {type: String},
        price : {type: Number},
        image :  {type: String},
        date : {type: Date}
        }],
  

    cart: [{
            id : {type: String},
            itemName: {type: String},
            price : {type: Number},
            quantity : {type : Number},
           
        }],

});

const User = mongoose.model('testUser',UserSchema);


module.exports = User;