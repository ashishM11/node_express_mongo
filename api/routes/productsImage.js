const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const productsImageModel = require("../models/productsImageModel");
const productModel = require("../models/productModel");
const responseGenerator = require("../response/repsonseGenerator");
const model_name = "productsImage";
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (request, file, next) => {
    console.log("Hello");
    next(null, "./image/");
  },
  filename: (request, file, next) => {
    next(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (request, file, next) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    next(null, true);
  } else {
    next(null, false);
  }
};

const images = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
});

router.post("/", images.single("productImage"), (request, response, next) => {
  console.log(request.file);
  productModel
    .findById(request.body.product)
    .then(result => {
      if (result !== null) {
        const productsImageObj = new productsImageModel({
          _id: new mongoose.Types.ObjectId(),
          product: request.body.product,
          filepath: request.file.path,
          filename: request.file.filename
        });
        return productsImageObj.save();
      } else {
        response.status(404).json({
          message: "Sorry, product image cannot be saved."
        });
      }
    })
    .then(result => {
      console.log(result);
      responseGenerator.postRequestResponse(result, response, model_name);
    })
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});
router.get("/", (request, response, next) => {
  productsImageModel
    .find()
    .select("product filepath filename")
    .populate("product", "productName productBrand productPrice")
    .exec()
    .then(docs =>
      responseGenerator.fetchedAllRecords(docs, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});
router.get("/:productsImageId", (request, response, next) => {
  if (request.params.productsImageId) {
    productsImageModel
      .findById(request.params.productsImageId)
      .populate("product", "productName productBrand productPrice")
      .exec()
      .then(resultObj => responseGenerator.fetchById(resultObj, response))
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

module.exports = router;
