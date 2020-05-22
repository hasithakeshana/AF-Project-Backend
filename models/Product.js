const mongoose = require("mongoose");

// Get the Schema constructor
const Schema = mongoose.Schema;

//color array used to keep the code dry
const colors = {
  red: {type:Number , default: 0} ,
  black: {type:Number , default: 0} ,
  white: {type:Number , default: 0} ,
  green: {type:Number , default: 0} ,  
  pink: {type:Number , default: 0} ,
  blue: {type:Number , default: 0} ,
  multi: {type:Number , default: 0} , 
};

// Using Schema constructor, create a ProductSchema
const ProductSchema = new Schema({
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
  sizeAvailable: {
    type: Boolean,
  },
  quantity: [{
    sQuantity: [{colors}] ,
    mQuantity: [{colors}] ,
    lQuantity: [{colors}] ,
    xlQuantity: [{colors}] ,   
  }],
  quantityInCart: {
    type: Number,
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
    comment : {type : String},
  }],

  
});

// Create model from the schema
var Product = mongoose.model("products", ProductSchema);

// Export model
module.exports = Product;

