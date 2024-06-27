import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import Logout from '../Logout/Logout';
import './HodProfile.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

const HodProfile = () => {
  const { user } = useContext(UserContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4000/lecture-api/pending-requests', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setPendingRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        setError('Failed to fetch pending requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [user]);

  const handleApproval = async (requestId, action) => {
    if (action === 'reject' && !rejectionReason) {
      setError('Rejection reason is required');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/lecture-api/${action}-request`, { requestId, reason: rejectionReason }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.data.success) {
        setPendingRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        await sendNotification(requestId, action, rejectionReason);
      } else {
        setError(response.data.message || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      setError('Failed to update request. Please try again later.');
    } finally {
      setRejectionReason('');
      setShowRejectionModal(false);
    }
  };

  const sendNotification = async (requestId, action, reason) => {
    try {
      await axios.post(`http://localhost:4000/lecture-api/send-notification`, {
        requestId,
        action,
        reason
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleReject = (requestId) => {
    setCurrentRequestId(requestId);
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = () => {
    handleApproval(currentRequestId, 'reject');
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text('Pending Requests Report', 20, 10);
    doc.autoTable({
      head: [['Faculty Name', 'Topic', 'Date', 'Time', 'Duration', 'Resource Person', 'Designation', 'Organization', 'Attendees', 'Year', 'Branch', 'Section', 'Venue', 'HOD Name', 'Description']],
      body: pendingRequests.map(request => [
        request.facultyName,
        request.topic,
        request.date,
        request.time,
        request.duration,
        request.resourcePerson,
        request.designation,
        request.organization,
        request.attendees,
        request.year,
        request.branch,
        request.section,
        request.venue,
        request.hodName,
        request.description
      ])
    });
    doc.save('pending_requests_report.pdf');
  };

  if (!user || user.role !== 'hod') {
    return <div className="unauthorized">Unauthorized access</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="hod-profile">
      <header className="header">
        <h1>HoD Profile</h1>
        <nav>
          <ul className="nav-list">
            <li><Link className="btn btn-primary" to="/hod-dashboard">Dashboard</Link></li> {/* Link to HodDashboard */}
            <li><button className="btn btn-info" onClick={handleGenerateReport}>Generate Report</button></li>
            <li><Logout /></li>
          </ul>
        </nav>
      </header>

      {error && <div className="error">{error}</div>}

      <h2>Pending Requests</h2>
      <ul className="requests-list">
        {pendingRequests.map((request) => (
          <li key={request._id} className="request-item">
            <div className="request-summary">
              <p><strong>Faculty Name:</strong> {request.facultyName}</p>
              <button
                className="btn btn-info"
                onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
              >
                {expandedRequest === request._id ? 'Hide Info' : 'More Info'}
              </button>
            </div>
            {expandedRequest === request._id && (
              <div className="request-details">
                <p><strong>Topic:</strong> {request.topic}</p>
                <p><strong>Date:</strong> {request.date}</p>
                <p><strong>Time:</strong> {request.time}</p>
                <p><strong>Duration:</strong> {request.duration}</p>
                <p><strong>Resource Person:</strong> {request.resourcePerson}</p>
                <p><strong>Designation:</strong> {request.designation}</p>
                <p><strong>Organization:</strong> {request.organization}</p>
                <p><strong>Attendees:</strong> {request.attendees}</p>
                <p><strong>Year:</strong> {request.year}</p>
                <p><strong>Branch:</strong> {request.branch}</p>
                <p><strong>Section:</strong> {request.section}</p>
                <p><strong>Venue:</strong> {request.venue}</p>
                <p><strong>HOD Name:</strong> {request.hodName}</p>
                <p><strong>Description:</strong> {request.description}</p>
                <div className="request-actions">
                  <button
                    className="btn btn-success btn-approve"
                    onClick={() => handleApproval(request._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-reject"
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {showRejectionModal && (
        <div className="rejection-modal">
          <div className="rejection-content">
            <h3>Rejection Reason</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection"
            ></textarea>
            <div className="request-actions">
              <button className="btn btn-danger" onClick={handleRejectSubmit}>Submit</button>
              <button className="btn btn-secondary" onClick={() => setShowRejectionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HodProfile;
