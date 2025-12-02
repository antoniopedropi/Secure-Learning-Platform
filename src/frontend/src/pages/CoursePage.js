import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import TopicList from '../components/TopicList';

const CoursePage = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setCourse(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the course!', error);
    });
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      {user && user.role === 'admin' && (
        <Link to={`/courses/${courseId}/topics/new`} className="btn btn-primary mb-3">Create New Topic</Link>
      )}
      <TopicList courseId={courseId} />
    </div>
  );
};

export default CoursePage;
