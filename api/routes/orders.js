const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const orderModel = require("../models/ordersModel");
const productModel = require("../models/productModel");
const checkAuth = require("../middleware/check-auth");
const responseGenerator = require("../response/repsonseGenerator");
const model_name = "orders";

router.get("/", checkAuth, (request, response, next) => {
  orderModel
    .find()
    .select("product quantity")
    .populate("product", "productName productBrand")
    .exec()
    .then(docs =>
      responseGenerator.fetchedAllRecords(docs, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

router.post("/", checkAuth, (request, response, next) => {
  productModel
    .findById(request.body.product)
    .then(result => {
      if (result !== null) {
        const orderObj = new orderModel({
          _id: new mongoose.Types.ObjectId(),
          product: request.body.product,
          quantity: request.body.productQuantity
        });
        return orderObj.save();
      } else {
        response.status(404).json({
          message: "Sorry, order cannot be placed, since no such product found."
        });
      }
    })
    .then(result =>
      responseGenerator.postRequestResponse(result, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

router.get("/:orderId", checkAuth, (request, response, next) => {
  if (request.params.orderId) {
    orderModel
      .findById(request.params.orderId)
      .populate("product", "productName productBrand")
      .exec()
      .then(resultObj => responseGenerator.fetchById(resultObj, response))
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.delete("/:orderId", checkAuth, (request, response, next) => {
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

router.patch("/:orderId", checkAuth, (request, response, next) => {
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
