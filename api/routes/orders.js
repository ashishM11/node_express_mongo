const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const orderModel = require("../models/ordersModel");
const responseGenerator = require("../response/repsonseGenerator");
const model_name = "orders";

router.get("/", (request, response, next) => {
  orderModel
    .find()
    .select("product_id quantity")
    .exec()
    .then(docs =>
      responseGenerator.fetchedAllRecords(docs, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

router.post("/", (request, response, next) => {
  const orderObj = new orderModel({
    _id: new mongoose.Types.ObjectId(),
    product_id: request.body.productId,
    quantity: request.body.productQuantity
  });
  const res = orderObj
    .save()
    .then(result =>
      responseGenerator.postRequestResponse(result, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));

  console.log(res);
});

router.get("/:orderId", (request, response, next) => {
  if (request.params.orderId) {
    orderModel
      .findById(request.params.orderId)
      .exec()
      .then(resultObj => responseGenerator.fetchById(resultObj, response))
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.delete("/:orderId", (request, response, next) => {
  if (request.params.orderId) {
    orderModel
      .deleteOne({ _id: request.params.orderId })
      .exec()
      .then(result =>
        responseGenerator.deletedById(
          result,
          response,
          model_name,
          request.params.orderId
        )
      )
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.patch("/:orderId", (request, response, next) => {
  const updateOps = {};
  for (const ops of request.body) {
    updateOps[ops.propertyName] = ops.value;
  }
  if (request.params.orderId) {
    orderModel
      .update({ _id: request.params.orderId }, { $set: updateOps })
      .exec()
      .then(result =>
        responseGenerator.updatedById(
          result,
          response,
          model_name,
          request.params.orderId
        )
      )
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

module.exports = router;
