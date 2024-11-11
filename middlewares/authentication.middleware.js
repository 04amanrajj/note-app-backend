const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      // get the data from black list
      // let data = fs.readFileSync("./blacklisted.json");
      // data = JSON.parse(data);
      //  check the current token in that file
      // data.sessions.forEach((blacklisted) => {
      // if the token is present in black that mean it's logged out user
      // if (blacklisted.token == token) {
      //  thorw errror user alreay is logged out
      // throw new Error("user is already logged out");
      // }
      // });

      const decoded = jwt.verify(token, "jsonwebtoken");

      if (decoded) {
        req.userID = decoded.userID;
        next();
      } else {
        res.status(403).send({ message: "please login" });
      }
    } else res.status(403).send({ message: "login first" });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};
