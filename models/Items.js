const mongoose = require("mongoose");

// Get the Schema constructor
const Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
const ItemSchema = new Schema({
  name: {
    type: String,
    
  },
  quantity: {
    type: Number,
   
  },
  // reviews: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Review'
  // }]
  ratings: [{
    userName: {type: String},
    rate : {type: Number},
    comment : {type : String}
   
     }],

  
});

// Create model from the schema
var Item = mongoose.model("Items", ItemSchema);

// Export model
module.exports = Item;

