import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.post('http://localhost:8000/token/refresh', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          localStorage.setItem('token', response.data.access_token);
        })
        .catch(error => {
          console.error('Error refreshing token', error);
        });
      }
    }, 15 * 60 * 1000); // 15 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
