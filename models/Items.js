const mongoose = require("mongoose");

// Get the Schema constructor
const Schema = mongoose.Schema;

// Using Schema constructor, create a ItemSchema
const ItemSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
   
  },
  productImage: {
    type: String,
    
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
var Item = mongoose.model("items", ItemSchema);

// Export model
module.exports = Item;

