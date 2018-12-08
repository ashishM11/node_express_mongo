const mongoose = require("mongoose");
const productImagesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
  filepath: { type: String },
  filename: { type: String }
});

module.exports = mongoose.model("productimages", productImagesSchema);
