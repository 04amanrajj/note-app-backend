const express = require("express");
const Router = require("express");
const {
  registerUser,
  loginUser,
  logout,
} = require("../controller/user.controller");
const userRoute = Router();

userRoute.use(express.json());

userRoute.post("/register", registerUser);

userRoute.post("/login", loginUser);

module.exports = { userRoute };
