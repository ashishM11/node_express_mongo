const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productName: { required: true, type: String },
  productBrand: { required: true, type: String },
  productPrice: { required: true, type: Number }
});

module.exports = mongoose.model("products", productSchema);
