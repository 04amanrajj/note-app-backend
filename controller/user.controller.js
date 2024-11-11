const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { logger } = require("../middlewares/userLogger.middleware");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { BlackListToken } = require("../models/blacklisted.model");

exports.registerUser = async (req, res) => {
  try {
    // from details
    const payLoad = req.body;

    //exists users
    const user = await UserModel.findOne({ email: payLoad.email });
    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }
    // match password
    if (payLoad.password != payLoad.confirmPassword) {
      return res.status(400).send({ message: "password didn't match" });
    }
    //encrypt password
    const hashPassword =await bcrypt.hash(payLoad.password, 10);
    payLoad.password = hashPassword;

    const newUser = new UserModel(payLoad);
    await newUser.save().catch((err) => {
      throw new Error(err.message);
    });

    // send response
    res.status(200).send({ message: "User registerd" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // login from data email & password
    const payLoad = req.body;
    // finding user
    const user = await UserModel.findOne({ email: payLoad.email });
    if (user) {
      //decrypt password to match
      bcrypt.compare(payLoad.password, user.password, (err, result) => {
        if (result) {
          // genrate limited time token
          const token = jwt.sign({ userID: user._id }, "jsonwebtoken", {
            expiresIn: 300,
          });
          delete user.password;
          // save log to file
          logger.info(`${user.name} is logged in`);
          // send response
          res.status(200).send({ message: "Logged in", token, user });
        } else {
          res.status(404).send({ message: "Wrong password" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const blackListed_Data = JSON.parse(
      fs.readFileSync("./blacklisted.json", "utf-8")
    );
    // check if token exist in list
    if (blackListed_Data.includes(token)) {
      return res.status(400).send({ message: "user is already logged out" });
    }

    // save token to mongoDB
    const newToken = new BlackListToken({ token });
    await newToken.save();
    blackListed_Data.push(token);
    fs.writeFileSync("./blacklisted.json", JSON.stringify(blackListed_Data));
    // console.log({ token });
    res.status(200).send({ message: "user logged out" });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ message: error.message });
  }
};
