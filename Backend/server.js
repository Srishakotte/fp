const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Deploy React build in this server
app.use(express.static(path.join(__dirname, '../client/build')));

// Connect to DB
MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const vnrdb = client.db('vnrdb');
    const facultycollection = vnrdb.collection('facultycollection');
    const hodscollection = vnrdb.collection('hodscollection');
    const adminscollection = vnrdb.collection('adminscollection');
    const lecturecollection = vnrdb.collection('lecturecollection');

    app.set('facultycollection', facultycollection);
    app.set('hodscollection', hodscollection);
    app.set('adminscollection', adminscollection);
    app.set('lecturecollection', lecturecollection);
    
    console.log("DB connection success");
  })
  .catch(err => console.log("Err in DB connection", err));

// Import API routes
const facultyApp = require('./APIs/faculty-api');
const hodApp = require('./APIs/hod-api');
const adminApp = require('./APIs/admin-api');
const lectureApp = require('./APIs/lecture-api');

// If path starts with faculty-api, send req to facultyApp
app.use('/faculty-api', facultyApp);
// If path starts with hod-api, send req to hodApp
app.use('/hod-api', hodApp);
// If path starts with admin-api, send req to adminApp
app.use('/admin-api', adminApp);
// If path starts with lecture-api, send req to lectureApp
app.use('/lecture-api', lectureApp);

// Serve React index.html for any other routes (client-side routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Express error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server error", error: err.message });
});

// Assign port number
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Web server running on port ${port}`));
