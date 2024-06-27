import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import './RequestPage.css';

const RequestPage = () => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
  const [resourcePerson, setResourcePerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [attendees, setAttendees] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [venue, setVenue] = useState('');
  const [hodName, setHodName] = useState('');
  const [hods, setHods] = useState([]);
  const [description, setDescription] = useState('');
  const [profileDocument, setProfileDocument] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHods = async () => {
      try {
        const response = await axios.get('http://localhost:4000/hod-api/hods', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          setHods(response.data.hods);
        } else {
          setError('Failed to fetch HOD names');
        }
      } catch (error) {
        setError('Failed to fetch HOD names');
      }
    };

    fetchHods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('date', date);
    formData.append('time', time);
    formData.append('duration', duration);
    formData.append('topic', topic);
    formData.append('resourcePerson', resourcePerson);
    formData.append('designation', designation);
    formData.append('organization', organization);
    formData.append('attendees', attendees);
    formData.append('year', year);
    formData.append('branch', branch);
    formData.append('section', section);
    formData.append('venue', venue);
    formData.append('hodName', hodName);
    formData.append('description', description);
    formData.append('facultyId', user ? user._id : null);
    formData.append('facultyName', user ? user.name : null);
    formData.append('profileDocument', profileDocument);

    try {
      const response = await axios.post('http://localhost:4000/lecture-api/submit-request', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Request submitted successfully!');
        navigate('/');
      } else {
        setError(response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Request submission failed');
    }
  };

  return (
    <div className="request-page">
      <form onSubmit={handleSubmit} className="request-form">
        <h2>Request Guest Lecture</h2>
        {error && <div className="error">{error}</div>}
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Time:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
        <label>
          Duration:
          <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </label>
        <label>
          Topic:
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required />
        </label>
        <label>
          Resource Person:
          <input type="text" value={resourcePerson} onChange={(e) => setResourcePerson(e.target.value)} required />
        </label>
        <label>
          Designation:
          <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
        </label>
        <label>
          Organization:
          <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
        </label>
        <label>
          Number of Attendees:
          <input type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} required />
        </label>
        <label>
          Year:
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required />
        </label>
        <label>
          Branch:
          <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} required />
        </label>
        <label>
          Section (optional):
          <input type="text" value={section} onChange={(e) => setSection(e.target.value)} />
        </label>
        <label>
          Venue:
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        </label>
        <label>
          HOD Name:
          <select value={hodName} onChange={(e) => setHodName(e.target.value)} required>
            <option value="" disabled>Select HOD</option>
            {hods.map((hod) => (
              <option key={hod._id} value={hod.username}>{hod.username}</option>
            ))}
          </select>
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Profile Document:
          <input type="file" onChange={(e) => setProfileDocument(e.target.files[0])} required />
        </label>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestPage;
