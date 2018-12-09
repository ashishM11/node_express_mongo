const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const responseGenerator = require("../response/repsonseGenerator");
const model_name = "users";

router.get("/", (request, response, next) => {
  userModel
    .find()
    .select("fname lname _id email mobile")
    .exec()
    .then(docs =>
      responseGenerator.fetchedAllRecords(docs, response, model_name)
    )
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

router.post("/signup", (request, response, next) => {
  userModel
    .find({
      $or: [{ email: request.body.email }, { mobile: request.body.mobile }]
    })
    .then(result => {
      if (result.length === 0) {
        bcrypt.hash(request.body.password, 11, (error, hash) => {
          if (error) {
            responseGenerator.handleErrorReceived(error, response);
          } else {
            const userObj = new userModel({
              _id: new mongoose.Types.ObjectId(),
              fname: request.body.fname,
              lname: request.body.lname,
              email: request.body.email,
              mobile: request.body.mobile,
              password: hash
            });
            userObj
              .save()
              .then(result =>
                responseGenerator.postRequestResponse(
                  result,
                  response,
                  model_name
                )
              )
              .catch(err =>
                responseGenerator.handleErrorReceived(err, response)
              );
          }
        });
      } else {
        response.status(409).json({
          message: "Sorry, user already exist in system."
        });
      }
    });
});

router.get("/:userId", (request, response, next) => {
  if (request.params.userId) {
    userModel
      .findById(request.params.userId)
      .exec()
      .then(resultObj => responseGenerator.fetchById(resultObj, response))
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.delete("/:userId", (request, response, next) => {
  if (request.params.userId) {
    userModel
      .remove({ _id: request.params.userId })
      .exec()
      .then(result =>
        responseGenerator.deletedById(
          result,
          response,
          model_name,
          request.params.userId
        )
      )
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.patch("/:userId", (request, response, next) => {
  if (request.params.userId) {
    const updateOps = {};
    for (const ops of request.body) {
      updateOps[ops.propertyName] = ops.value;
    }
    userModel
      .update({ _id: request.params.userId }, { $set: updateOps })
      .exec()
      .then(result =>
        responseGenerator.updatedById(
          result,
          response,
          model_name,
          request.params.userId
        )
      )
      .catch(err => responseGenerator.handleErrorReceived(err, response));
  }
});

router.post("/login", (request, response, next) => {
  userModel
    .findOne({ email: request.body.email })
    .exec()
    .then(user => {
      if (user !== null) {
        bcrypt.compare(
          request.body.password,
          user.password,
          (error, result) => {
            if (error) {
              responseGenerator.sendCustomMessage(401, "Auth failed", response);
            } else if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user._id
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h"
                }
              );
              responseGenerator.sendCustomMessage(
                200,
                "Auth successful",
                response,
                token
              );
            } else {
              responseGenerator.sendCustomMessage(401, "Auth failed", response);
            }
          }
        );
      } else {
        responseGenerator.sendCustomMessage(401, "Auth failed", response);
      }
    })
    .catch(err => responseGenerator.handleErrorReceived(err, response));
});

module.exports = router;
