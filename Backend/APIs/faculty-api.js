const express = require('express');
const facultyApp = express.Router();
const bcryptjs = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = require('../Middlewares/verifyToken');

let facultycollection;

// Middleware to set the collection
facultyApp.use((req, res, next) => {
  facultycollection = req.app.get('facultycollection');
  next();
});

// Register route
facultyApp.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const newFaculty = req.body;
    const dbFaculty = await facultycollection.findOne({ username: newFaculty.username });

    if (dbFaculty) {
      return res.status(400).send({ success: false, message: 'Faculty already exists' });
    }

    const hashedPassword = await bcryptjs.hash(newFaculty.password, 6);
    newFaculty.password = hashedPassword;
    await facultycollection.insertOne(newFaculty);
    res.status(201).send({ success: true, message: 'Faculty created' });
  })
);

// Login route
facultyApp.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const facultyCred = req.body;
    const dbFaculty = await facultycollection.findOne({ username: facultyCred.username });

    if (!dbFaculty) {
      return res.status(401).send({ success: false, message: 'Invalid username' });
    }

    const status = await bcryptjs.compare(facultyCred.password, dbFaculty.password);
    if (!status) {
      return res.status(401).send({ success: false, message: 'Invalid password' });
    }

    const signedToken = jwt.sign({ username: dbFaculty.username, role: 'faculty' }, process.env.SECRET_KEY, { expiresIn: '1d' });
    res.send({ success: true, message: 'Login success', token: signedToken, user: dbFaculty });
  })
);

// Profile route
facultyApp.get(
  '/profile',
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    try {
      const username = req.user.username;
      const facultyDetails = await facultycollection.findOne({ username });

      if (!facultyDetails) {
        return res.status(404).send({ success: false, message: 'Profile not found' });
      }

      res.send({ success: true, message: 'Profile data', data: facultyDetails });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      res.status(500).send({ success: false, message: 'Internal Server Error', error: error.message });
    }
  })
);

module.exports = facultyApp;
