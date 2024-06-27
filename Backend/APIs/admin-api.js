const exp = require("express");
const adminApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require('../Middlewares/verifyToken');
require("dotenv").config();

let adminscollection;

// Get adminscollection from app
adminApp.use((req, res, next) => {
  adminscollection = req.app.get("adminscollection");
  next();
});

// Admin registration route
adminApp.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const newUser = req.body;
    const dbuser = await adminscollection.findOne({ username: newUser.username });
    if (dbuser !== null) {
      res.send({ message: "Admin already exists" });
    } else {
      const hashedPassword = await bcryptjs.hash(newUser.password, 6);
      newUser.password = hashedPassword;
      await adminscollection.insertOne(newUser);
      res.send({ message: "Admin created" });
    }
  })
);

// Admin login route
adminApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    console.log('Login request received:', req.body);
    const userCred = req.body;
    const dbuser = await adminscollection.findOne({ username: userCred.username });
    if (dbuser === null) {
      console.log('Invalid username');
      res.send({ message: "Invalid username" });
    } else {
      const status = await bcryptjs.compare(userCred.password, dbuser.password);
      if (status === false) {
        console.log('Invalid password');
        res.send({ message: "Invalid password" });
      } else {
        const signedToken = jwt.sign({ username: dbuser.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
        console.log('Login success:', dbuser.username);
        res.send({ message: "login success", token: signedToken, user: dbuser });
      }
    }
  })
);
adminApp.get(
  "/profile",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const username = req.user.username;
    const adminDetails= await adminscollection.findOne({ username });
    res.send({ message: "Profile data", data: adminDetails });
  })
);

module.exports = adminApp;
