const mongoose = require("mongoose");

// Get the Schema constructor
const Schema = mongoose.Schema;

// Using Schema constructor, create a ItemSchema
const ItemSchema = new Schema({
  itemID: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
    minimum: 1,
  },
  discount: {
    type: Number,
    default: 0,
    max: 99,
  },
  description: {
    type: String,
  },
  mainCategory: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  quantityInCart: {
    type: Number,
    min: 1,
  },
  cartIn: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array,
    
  },
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

