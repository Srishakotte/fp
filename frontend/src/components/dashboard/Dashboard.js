import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [filterLectureName, setFilterLectureName] = useState('');
  const [filterResourcePerson, setFilterResourcePerson] = useState('');
  const [filterFacultyCoordinator, setFilterFacultyCoordinator] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4000/lecture-api/approved-requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          setRequests(response.data.requests);
          setFilteredRequests(response.data.requests);
        } else {
          setError('Failed to fetch approved requests');
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch approved requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = requests;

      if (filterLectureName) {
        filtered = filtered.filter(request =>
          request.lectureName.toLowerCase().includes(filterLectureName.toLowerCase())
        );
      }

      if (filterResourcePerson) {
        filtered = filtered.filter(request =>
          request.resourcePerson.toLowerCase().includes(filterResourcePerson.toLowerCase())
        );
      }

      if (filterFacultyCoordinator) {
        filtered = filtered.filter(request =>
          request.facultyCoordinator.toLowerCase().includes(filterFacultyCoordinator.toLowerCase())
        );
      }

      if (filterDate) {
        filtered = filtered.filter(request =>
          request.date === filterDate
        );
      }

      setFilteredRequests(filtered);
    };

    applyFilters();
  }, [filterLectureName, filterResourcePerson, filterFacultyCoordinator, filterDate, requests]);

  const getUniqueOptions = (key) => {
    return [...new Set(requests.map(request => request[key]))];
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <div className="error">{error}</div>}
          <div className="filters">
            <select value={filterLectureName} onChange={(e) => setFilterLectureName(e.target.value)}>
              <option value="">All Lectures</option>
              {getUniqueOptions('lectureName').map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            <select value={filterResourcePerson} onChange={(e) => setFilterResourcePerson(e.target.value)}>
              <option value="">All Resource Persons</option>
              {getUniqueOptions('resourcePerson').map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            <select value={filterFacultyCoordinator} onChange={(e) => setFilterFacultyCoordinator(e.target.value)}>
              <option value="">All Faculty Coordinators</option>
              {getUniqueOptions('facultyCoordinator').map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="">All Dates</option>
              {getUniqueOptions('date').map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name of Lecture</th>
                <th>Resource Person</th>
                <th>Faculty Coordinator</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Topic</th>
                <th>Designation</th>
                <th>Organization</th>
                <th>Attendees</th>
                <th>Year</th>
                <th>Branch</th>
                <th>Section</th>
                <th>HOD Name</th>
                <th>Faculty Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>{request.lectureName}</td>
                  <td>{request.resourcePerson}</td>
                  <td>{request.facultyCoordinator}</td>
                  <td>{request.venue}</td>
                  <td>{request.date}</td>
                  <td>{request.time}</td>
                  <td>{request.duration}</td>
                  <td>{request.topic}</td>
                  <td>{request.designation}</td>
                  <td>{request.organization}</td>
                  <td>{request.attendees}</td>
                  <td>{request.year}</td>
                  <td>{request.branch}</td>
                  <td>{request.section}</td>
                  <td>{request.hodName}</td>
                  <td>{request.facultyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Dashboard;
