const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
  quantity: { required: true, default: 1, type: Number }
});

module.exports = mongoose.model("orders", ordersSchema);
