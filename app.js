const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let mongoAtlasURL =
  "mongodb+srv://ashishMongo:<PASSWORD>@mongo-cloud-pracs-myied.mongodb.net/retail_store?retryWrites=true";

mongoose.connect(
  mongoAtlasURL.replace("<PASSWORD>", process.env.MONGO_ATLAS_Pw),
  { useNewUrlParser: true }
);

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const productsImageRoutes = require("./api/routes/productsImage");
const usersRoutes = require("./api/routes/users");

app.use(morgan("dev"));
app.use("/image", express.static("image"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-headers",
    "Origin,X-Requested-With,Content-Type, Accept, Authorization"
  );
  if (request.method === "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      "PUT,GET,POST,PATCH,DELETE"
    );
    return response.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/productsImage", productsImageRoutes);
app.use("/users", usersRoutes);

app.use((request, Response, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 500).json({
    message: error.message
  });
});

module.exports = app;
