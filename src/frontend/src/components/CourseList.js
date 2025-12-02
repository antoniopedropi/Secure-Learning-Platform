import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  const isUserOwnerOrAdmin = (course) => {
    if (user.role === 'admin') {
      return true;
    }
    return course.owners.some(owner => owner.id === user.id);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/courses', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setCourses(response.data);
      setFilteredCourses(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the courses!', error);
    });
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, courses]);

  const handleDelete = (courseId) => {
    axios.delete(`http://localhost:8000/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
    })
    .catch(error => {
      console.error('There was an error deleting the course!', error);
    });
  };

  return (
    <div className="container mt-4">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search courses"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="list-group" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {filteredCourses.map(course => (
          <div key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/courses/${course.id}`}>{course.title}</Link>
              <p>{course.description}</p>
              <p><strong>Owners:</strong> {course.owners.map(owner => owner.username).join(', ')}</p>
              <p><strong>Participants:</strong> {course.participants.map(participant => participant.username).join(', ')}</p> {/* Adicione esta linha para mostrar os participantes */}
            </div>
            {user && isUserOwnerOrAdmin(course) && (
              <div>
                <Link to={`/courses/${course.id}/edit`} className="btn btn-sm btn-primary mr-2">Edit</Link>
                {/*<button className="btn btn-sm btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>*/}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
