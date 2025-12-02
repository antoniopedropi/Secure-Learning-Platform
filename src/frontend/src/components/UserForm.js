import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import sha256 from 'crypto-js/sha256';

const UserForm = ({ isCreating }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');  // Default role is student

  console.log("isCreating: ", isCreating);

  useEffect(() => {
    if (userId && !isCreating) {
      axios.get(`http://localhost:8000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setRole(response.data.role);
      })
      .catch(error => {
        console.error('There was an error fetching the user!', error);
      });
    }
  }, [userId, isCreating]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const hashedPassword = sha256(password).toString();
    const data = { username, email, password:hashedPassword, role };
    const url = isCreating ? 'http://localhost:8000/users/' : `http://localhost:8000/users/${userId}`;
    const method = isCreating ? 'post' : 'put';
    axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      toast.success(`${isCreating ? 'Created' : 'Updated'} user successfully!`);
      navigate('/admin');
    })
    .catch(error => {
      console.error('There was an error saving the user!', error);
      toast.error('There was an error saving the user.');
    });
  };

  return (
    <div className="container mt-4">
      <h2>{isCreating ? 'Create New User' : 'Edit User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{isCreating ? 'Create' : 'Update'} User</button>
      </form>
    </div>
  );
};

export default UserForm;
