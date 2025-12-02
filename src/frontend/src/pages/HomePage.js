import React, {useContext} from 'react';
import CourseList from '../components/CourseList';
import CourseForm from '../components/CourseForm';
import {AuthContext} from '../AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  console.log("User: ", user);
  const token = localStorage.getItem('token');
  return (
    <div>
      <h1>Learning Platform</h1>
      {token ? (<CourseList />) : null}
    </div>
  );
};

export default HomePage;
