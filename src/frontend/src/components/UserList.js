import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {AuthContext} from '../AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:8000/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const nonAdminUsers = response.data.filter(u => u.role !== 'admin');
      setUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers);
    })
    .catch(error => {
      console.error('There was an error fetching the users!', error);
    });
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:8000/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    })
    .catch(error => {
      console.error('There was an error deleting the user!', error);
    });
  };

  return (
    <div className="container mt-4">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="list-group" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {filteredUsers.map(user => (
          <div key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {user.username} - {user.email} - {user.role}
            </div>
            <div>
              <Link to={`/admin/users/${user.id}/edit`} className="btn btn-sm btn-primary mr-2">Edit</Link>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
