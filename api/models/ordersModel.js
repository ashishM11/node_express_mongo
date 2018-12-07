const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product_id: { required: true, type: String },
  quantity: { required: true, default: 1, type: Number }
});

module.exports = mongoose.model("orders", ordersSchema);
