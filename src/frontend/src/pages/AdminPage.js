import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import CourseList from '../components/CourseList';
import UserList from '../components/UserList';
import {AuthContext} from '../AuthContext';
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import axios from 'axios';

const AdminPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  console.log(AuthContext);
  useEffect(() => {
    const checkAuth = () => {
      let userRole ="";
      const token = localStorage.getItem('token');
      if(token){axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          setUser(res.data);
          userRole = res.data.role
          if(userRole !== 'admin'){
            navigate('/login');
          }
          console.log("Use Role With Token: ", userRole)
          // console.log("userRole: ", res.data.role);
          })
        .catch(err => {
          console.error('Error fetching user data:', err);
          toast.error('Failed to fetch user data.');
        });}
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
      } else {
        const allowedRoles = ['admin']; // Example roles
        //console.log("CONSOLE:LOG :", userRole);
        if(userRole!==""){if (!allowedRoles.includes(userRole)) {
          navigate('/login');
        }}
      }
    }
    checkAuth();
  }, [navigate]);


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Panel</h1>
      <div className="row mb-4">
        <div className="col-12">
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <Link to="/courses/new" className="btn btn-primary mr-2">Create New Course</Link>
          <h2>Manage Courses</h2>
          <CourseList />
        </div>
        <div className="col-md-6 mb-4">
          <Link to="/admin/users/new" className="btn btn-primary">Create New User</Link>
          <h2>Manage Users</h2>
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
