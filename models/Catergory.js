const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const catergorySchema = new Schema({

    id: { type : Number},
    mainCat : {  type : String   },
    subCat : {  type : String   },
    
});

const User = mongoose.model('user',catergorySchema);


module.exports = User;