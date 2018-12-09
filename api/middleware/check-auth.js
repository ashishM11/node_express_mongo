const jwt = require("jsonwebtoken");
const responseGenerator = require("../response/repsonseGenerator");

module.exports = (request, response, next) => {
  try {
    const decoded = jwt.verify(
      request.headers.authorization.split(" ")[1],
      process.env.JWT_KEY
    );
    request.userData = decoded;
    next();
  } catch (error) {
    responseGenerator.sendCustomMessage(401, "Auth failed", response);
  }
};
