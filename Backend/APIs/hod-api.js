const express = require('express');
const hodApp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../Middlewares/verifyToken');
const axios = require('axios');

let hodscollection, lecturecollection;

// Middleware to get collections from app
hodApp.use((req, res, next) => {
  hodscollection = req.app.get('hodscollection');
  lecturecollection = req.app.get('lecturecollection');
  next();
});

// HOD registration route
hodApp.post('/register', expressAsyncHandler(async (req, res) => {
  const newHod = req.body;
  const dbHod = await hodscollection.findOne({ username: newHod.username });
  if (dbHod) {
    res.send({ message: "HOD already exists" });
  } else {
    const hashedPassword = await bcryptjs.hash(newHod.password, 6);
    newHod.password = hashedPassword;
    await hodscollection.insertOne(newHod);
    res.send({ message: "HOD created" });
  }
}));

// HOD login route
hodApp.post('/login', expressAsyncHandler(async (req, res) => {
  const hodCred = req.body;
  console.log('HOD login credentials:', hodCred);

  const dbHod = await hodscollection.findOne({ username: hodCred.username });
  if (!dbHod) {
    console.log('Invalid username');
    res.status(401).send({ message: "Invalid username" });
  } else {
    const status = await bcryptjs.compare(hodCred.password, dbHod.password);
    if (!status) {
      console.log('Invalid password');
      res.status(401).send({ message: "Invalid password" });
    } else {
      const signedToken = jwt.sign({ username: dbHod.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
      console.log('Login success');
      res.send({ message: "Login success", token: signedToken, user: dbHod });
    }
  }
}));

// HOD profile route
hodApp.get('/profile', verifyToken, expressAsyncHandler(async (req, res) => {
  const username = req.user.username;

  try {
    const hodDetails = await hodscollection.findOne({ username });

    if (!hodDetails) {
      return res.status(404).send({ message: "HOD not found" });
    }

    // Fetch pending requests from lecture-api
    const lectureApiUrl = 'http://localhost:4000/lecture-api/pending-requests';
    const response = await axios.get(lectureApiUrl, {
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`
      }
    });

    if (response.data.success) {
      const pendingRequests = response.data.requests;
      res.json({ message: "Profile data", data: { ...hodDetails, pendingRequests } });
    } else {
      throw new Error('Failed to fetch pending requests from lecture API');
    }
  } catch (error) {
    console.error('Error fetching HOD profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch HOD profile data' });
  }
}));

// Fetch HODs route
hodApp.get('/hods', expressAsyncHandler(async (req, res) => {
  try {
    const hods = await hodscollection.find({}).toArray();
    res.send({ success: true, hods });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch HODs' });
  }
}));

module.exports = hodApp;
