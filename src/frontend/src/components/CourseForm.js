import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';

const CourseForm = ({ isCreating }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owners, setOwners] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [participantSearchTerm, setParticipantSearchTerm] = useState('');

  useEffect(() => {
    if (!isCreating && courseId) {
      axios.get(`http://localhost:8000/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        const course = response.data;
        console.log(course)
        setTitle(course.title);
        setDescription(course.description);
        setSelectedOwners(course.owners.map(owner => owner.id?.toString() || ''));
        setSelectedParticipants(course.participants.map(participant => participant.id?.toString() || ''));
      })
      .catch(error => {
        console.error('There was an error fetching the course!', error);
      });
    }

    axios.get('http://localhost:8000/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setAllUsers(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the users!', error);
    });
  }, [courseId, isCreating]);

  const handleOwnerChange = (event) => {
    const value = event.target.value;
    if (selectedOwners.includes(value)) {
      setSelectedOwners(selectedOwners.filter(id => id !== value));
    } else {
      setSelectedOwners([...selectedOwners, value]);
    }
  };

  const handleParticipantChange = (event) => {
    const value = event.target.value;
    if (selectedParticipants.includes(value)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== value));
    } else {
      setSelectedParticipants([...selectedParticipants, value]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { title, description };
    const url = isCreating ? 'http://localhost:8000/courses/' : `http://localhost:8000/courses/${courseId}`;
    const method = isCreating ? 'post' : 'put';

    try {
      const response = await axios[method](url, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const courseId = response.data.id;
      const existingOwnerIds = new Set(response.data.owners.map(owner => owner.id?.toString() || ''));
      const newOwnerIds = new Set(selectedOwners);
      const existingParticipantIds = new Set(response.data.participants.map(participant => participant.id?.toString() || ''));
      const newParticipantIds = new Set(selectedParticipants);

      const ownersToAdd = [...newOwnerIds].filter(id => id && !existingOwnerIds.has(id));
      const ownersToRemove = [...existingOwnerIds].filter(id => id && !newOwnerIds.has(id));
      const participantsToAdd = [...newParticipantIds].filter(id => id && !existingParticipantIds.has(id));
      const participantsToRemove = [...existingParticipantIds].filter(id => id && !newParticipantIds.has(id));

      console.log('ownersToAdd:', ownersToAdd);
      console.log('ownersToRemove:', ownersToRemove);
      console.log('participantsToAdd:', participantsToAdd);
      console.log('participantsToRemove:', participantsToRemove);

      const addOwnerPromises = ownersToAdd.map(ownerId =>
        axios.post(`http://localhost:8000/courses/${courseId}/owners/${ownerId}`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      const removeOwnerPromises = ownersToRemove.map(ownerId =>
        axios.delete(`http://localhost:8000/courses/${courseId}/owners/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      const addParticipantPromises = participantsToAdd.map(participantId =>
        axios.post(`http://localhost:8000/courses/${courseId}/participants/${participantId}`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      const removeParticipantPromises = participantsToRemove.map(participantId =>
        axios.delete(`http://localhost:8000/courses/${courseId}/participants/${participantId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      await Promise.all([...addOwnerPromises, ...removeOwnerPromises, ...addParticipantPromises, ...removeParticipantPromises]);

      toast.success(`${isCreating ? 'Created' : 'Updated'} course successfully!`);
      navigate('/admin');
    } catch (error) {
      console.error('There was an error saving the course!', error);
      toast.error('There was an error saving the course.');
    }
  };

  const filteredOwners = allUsers.filter(user =>
    user.username.toLowerCase().includes(ownerSearchTerm.toLowerCase())
  );

  const filteredParticipants = allUsers.filter(user =>
    user.username.toLowerCase().includes(participantSearchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>{isCreating ? 'Create New Course' : 'Edit Course'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className="form-group">
          <label>Owners:</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search owners"
            value={ownerSearchTerm}
            onChange={(e) => setOwnerSearchTerm(e.target.value)}
          />
          <div className="form-check" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            {filteredOwners.map(owner => (
              <div key={owner.id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={owner.id}
                  checked={selectedOwners.includes(owner.id?.toString() || '')}
                  onChange={handleOwnerChange}
                />
                <label className="form-check-label">{owner.username}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Participants:</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search participants"
            value={participantSearchTerm}
            onChange={(e) => setParticipantSearchTerm(e.target.value)}
          />
          <div className="form-check" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            {filteredParticipants.map(participant => (
              <div key={participant.id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={participant.id}
                  checked={selectedParticipants.includes(participant.id?.toString() || '')}
                  onChange={handleParticipantChange}
                />
                <label className="form-check-label">{participant.username}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{isCreating ? 'Create' : 'Update'} Course</button>
      </form>
    </div>
  );
};

export default CourseForm;
