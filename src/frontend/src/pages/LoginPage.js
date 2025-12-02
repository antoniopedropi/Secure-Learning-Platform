import React, {useContext, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../AuthContext';
import {toast} from "react-toastify";
import sha256 from 'crypto-js/sha256';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new URLSearchParams();
    const hashedPassword = sha256(password).toString();
    data.append('username', username);
    data.append('password', hashedPassword);

    axios.post('http://localhost:8000/token', data)
      .then(response => {
        localStorage.setItem('token', response.data.access_token);
        return axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          }
        })
        .then(res => {
          setUser(res.data);
          if (res.data.role === 'admin') {
            navigate('/admin');  // Redireciona para o painel de administração se for admin
          } else {
            navigate('/');  // Redireciona para a página principal se não for admin
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          toast.error('Failed to fetch user data.');
        });
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-group">
        <label>Username:</label>
        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary mt-3">Login</button>
    </form>
  );
};

export default LoginPage;
