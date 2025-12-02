import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";

const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  const { user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userRole =""
      const token = localStorage.getItem('token');
      if(token){axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          setUser(res.data);
          userRole = res.data.role
          console.log("userRole: ", res.data.role);
          })
        .catch(err => {
          console.error('Error fetching user data:', err);
          toast.error('Failed to fetch user data.');
        });}
      if (!token) {
        navigate('/login');
      } else {
        const allowedRoles = ['student'];

        if(userRole!=""){if (!allowedRoles.includes(userRole)) {
          navigate('/login');
        }}
      }
    }
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:8000/users/me/courses', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setCourses(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the courses!', error);
    });
  }, [user]);

  return (
    <div>
      <h2>My Courses</h2>
      <ul className="list-group">
        {courses.map(course => (
          <li key={course.id} className="list-group-item">
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentPage;