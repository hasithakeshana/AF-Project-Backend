const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({

    firstName : {  type : String, required: true   },
    lastName : {  type : String,  required: true   },
    email : {  type : String,  required: true, unique: true  },
    password : {  type : String ,  required: true  },
    isVerified: {type: Boolean, default: false}//will be true after email verification

});


const User = mongoose.model('user',UserSchema);


module.exports = User;