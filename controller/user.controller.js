const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { logger } = require("../middlewares/userLogger.middleware");
const bcrypt = require("bcrypt");
const fs = require("fs");

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
    // empty from
    if (!payLoad) {
      return res.status(400).send({ message: "fields are empty" });
    }
    //encrypt password
    bcrypt.hash(payLoad.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).send({ err });
      } else {
        payLoad.password = hash;
        const user = new UserModel(payLoad);
        await user.save();
      }
    });
    // send response
    res.status(200).send({ message: "User registerd" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
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
          res.status(404).send({ message: "Wrong Credntials" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

exports.logout = (req, res) => {
  try {
    const token = req.headers.authorization;
    let data = fs.readFileSync("./blacklisted.json", "utf8");
    data = JSON.parse(data);
    data.sessions.push({ token });
    fs.writeFileSync("./blacklisted.json", JSON.stringify(data), "utf8");
    res.status(200).send({ message: "User logged out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};
