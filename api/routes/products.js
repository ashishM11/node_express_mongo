const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const responseGenerator = require("../response/repsonseGenerator");
const model_name = "products";

router.get("/", (request, response, next) => {
  productModel
    .find()
    .select("productName productPrice _id productBrand")
    .exec()
    .then(docs =>
      responseGenerator.fetchedAllRecords(docs, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

router.post("/", (request, response, next) => {
  const productObj = new productModel({
    _id: new mongoose.Types.ObjectId(),
    productName: request.body.productName,
    productBrand: request.body.productBrand,
    productPrice: request.body.productPrice
  });
  productObj
    .save()
    .then(result =>
      responseGenerator.postRequestResponse(result, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

router.get("/:productId", (request, response, next) => {
  if (request.params.productId) {
    productModel
      .findById(request.params.productId)
      .exec()
      .then(resultObj => responseGenerator.fetchById(resultObj, response))
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.delete("/:productId", (request, response, next) => {
  if (request.params.productId) {
    productModel
      .remove({ _id: request.params.productId })
      .exec()
      .then(result =>
        responseGenerator.deletedById(
          result,
          response,
          model_name,
          request.params.productId
        )
      )
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.patch("/:productId", (request, response, next) => {
  if (request.params.productId) {
    const updateOps = {};
    for (const ops of request.body) {
      updateOps[ops.propertyName] = ops.value;
    }
    productModel
      .update({ _id: request.params.productId }, { $set: updateOps })
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
