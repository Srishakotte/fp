const express = require('express');
const lectureApp = express.Router();
const { ObjectId } = require('mongodb');
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config();
const verifyToken = require('../Middlewares/verifyToken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies
lectureApp.use(express.json());

// Endpoint to submit a guest lecture request
lectureApp.post('/submit-request', upload.single('profileDocument'), expressAsyncHandler(async (req, res) => {
  const { date, time, duration, topic, resourcePerson, designation, organization, attendees, year, branch, section, venue, hodName, description, facultyId, facultyName } = req.body;
  const profileDocument = req.file;
  const lecturecollection = req.app.get('lecturecollection');
  const facultycollection = req.app.get('facultycollection');
  const hodscollection = req.app.get('hodscollection');

  if (!date || !time || !duration || !topic || !resourcePerson || !designation || !organization || !attendees || !year || !branch || !venue || !hodName || !description || !facultyId || !facultyName || !profileDocument) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    if (!ObjectId.isValid(facultyId)) {
      return res.status(400).json({ success: false, message: 'Invalid Faculty ID format' });
    }

    const faculty = await facultycollection.findOne({ _id: new ObjectId(facultyId) });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    const hod = await hodscollection.findOne({ username: hodName });
    if (!hod) {
      return res.status(404).json({ success: false, message: 'HOD not found' });
    }

    const result = await lecturecollection.insertOne({
      date,
      time,
      duration,
      topic,
      resourcePerson,
      designation,
      organization,
      attendees,
      year,
      branch,
      section,
      venue,
      hodName,
      description,
      facultyId,
      facultyName,
      profileDocument: profileDocument.path,
      status: 'pending'
    });

    res.json({ success: true, message: 'Request submitted successfully', data: result.insertedId });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ success: false, message: 'Failed to submit request', error: error.message });
  }
}));

// Endpoint to approve a guest lecture request
lectureApp.post('/approve-request', verifyToken, expressAsyncHandler(async (req, res) => {
  const { requestId } = req.body;
  const lecturecollection = req.app.get('lecturecollection');

  if (!requestId) {
    return res.status(400).json({ success: false, message: 'Request ID is required' });
  }

  try {
    if (!ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid Request ID format' });
    }

    const result = await lecturecollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'approved' } }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: 'Request approved successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ success: false, message: 'Failed to approve request', error: error.message });
  }
}));

// Endpoint to reject a guest lecture request
lectureApp.post('/reject-request', verifyToken, expressAsyncHandler(async (req, res) => {
  const { requestId } = req.body;
  const lecturecollection = req.app.get('lecturecollection');

  if (!requestId) {
    return res.status(400).json({ success: false, message: 'Request ID is required' });
  }

  try {
    if (!ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid Request ID format' });
    }

    const result = await lecturecollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'rejected' } }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: 'Request rejected successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ success: false, message: 'Failed to reject request', error: error.message });
  }
}));

// Endpoint to fetch pending guest lecture requests for HOD
lectureApp.get('/pending-requests', verifyToken, expressAsyncHandler(async (req, res) => {
  const lecturecollection = req.app.get('lecturecollection');
  const hodscollection = req.app.get('hodscollection');
  const { username } = req.user;

  try {
    const hod = await hodscollection.findOne({ username });
    if (!hod) {
      return res.status(404).json({ success: false, message: 'HOD not found' });
    }

    const requests = await lecturecollection.find({ hodName: hod.username, status: 'pending' }).toArray();
    res.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending requests', error: error.message });
  }
}));

// Endpoint to fetch approved guest lecture requests
lectureApp.get('/approved-requests', verifyToken, expressAsyncHandler(async (req, res) => {
  const lecturecollection = req.app.get('lecturecollection');

  try {
    const approvedRequests = await lecturecollection.find({ status: 'approved' }).toArray();
    res.json({ success: true, requests: approvedRequests });
  } catch (error) {
    console.error("Error fetching approved requests:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch approved requests', error: error.message });
  }
}));

// Endpoint to fetch completed and scheduled guest lecture requests
lectureApp.get('/completed-and-scheduled', verifyToken, expressAsyncHandler(async (req, res) => {
  const lecturecollection = req.app.get('lecturecollection');

  try {
    const completedAndScheduledRequests = await lecturecollection.find({
      $or: [{ status: 'completed' }, { status: 'scheduled' }]
    }).toArray();

    console.log("Fetched requests:", completedAndScheduledRequests);
    res.json({ success: true, requests: completedAndScheduledRequests });
  } catch (error) {
    console.error("Error fetching completed and scheduled requests:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch lecture details', error: error.message });
  }
}));

// Endpoint to send a notification to the faculty
lectureApp.post('/send-notification', verifyToken, expressAsyncHandler(async (req, res) => {
  const { requestId, action } = req.body;
  const lecturecollection = req.app.get('lecturecollection');
  const facultycollection = req.app.get('facultycollection');

  try {
    const lecture = await lecturecollection.findOne({ _id: new ObjectId(requestId) });
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const faculty = await facultycollection.findOne({ _id: new ObjectId(lecture.facultyId) });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    const message = `Your guest lecture request for "${lecture.topic}" has been ${action}ed.`;

    await facultycollection.updateOne(
      { _id: new ObjectId(lecture.facultyId) },
      { $push: { notifications: { message, date: new Date() } } }
    );

    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
}));

// Endpoint to fetch notifications for a faculty
lectureApp.get('/notifications', verifyToken, expressAsyncHandler(async (req, res) => {
  const facultycollection = req.app.get('facultycollection');
  const { username } = req.user;

  try {
    const faculty = await facultycollection.findOne({ username });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.json({ success: true, notifications: faculty.notifications || [] });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
}));

module.exports = lectureApp;
