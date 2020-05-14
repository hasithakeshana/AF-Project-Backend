const mongoose = require("mongoose");

// Get the Schema constructor
const Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
const ProductSchema = new Schema({
  itemID: {
    type: Number,
    
  },
  name: {
    type: String,
   
  },
  price: {
    type: Number,
   
  },
  description: {
    type: String,
   
  },
  mainCategory:{
    type: String,
  },
  subCategory:{
    type: String,
  },
  quantityInCart:{
    type: Number,
  },
  cartIn:{
      type : Boolean,
  },
  quantity:{
    type: Number,
  },
  ratings: [{
    userName: {type: String},
    rate : {type: Number},
    comment : {type : String},
    date : {type: Date}
     }],

 images :[
       {
        productImage : {type:String}
       }
      
      ],

  
});

// Create model from the schema
var Product = mongoose.model("Products", ProductSchema);

// Export model
module.exports = Product;

