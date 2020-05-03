const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const managerSchema = new Schema({

    firstName : {  type : String   },
    lastName : {  type : String   },
    email : {  type : String   },
    password : {  type : String   },

});

const manager = mongoose.model('user',managerSchema);


module.exports = manager;