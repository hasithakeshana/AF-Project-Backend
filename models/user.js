const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({

    firstName : {  type : String   },
    lastName : {  type : String   },
    email : {  type : String   },
    password : {  type : String   },

    wishlist: [{
        itemName: {type: String},
        price : {type: Number},
        quantity : {type : Number},
        date : {type: Date}
        }],

    cart: [{
            id : {type: String},
            itemName: {type: String},
            price : {type: Number},
            quantity : {type : Number},
           
        }],

});

const User = mongoose.model('user',UserSchema);


module.exports = User;