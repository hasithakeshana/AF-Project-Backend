const mongoose = require("mongoose");

// Get the Schema constructor
const Schema = mongoose.Schema;

// Using Schema constructor, create a ItemSchema
const CategorySchema = new Schema({
  category: {
    type: String,
    
  },
  subCategory: {
    type: Array,
  },
  
});

// Create model from the schema
var Category = mongoose.model("categories", CategorySchema);

// Export model
module.exports = Category;