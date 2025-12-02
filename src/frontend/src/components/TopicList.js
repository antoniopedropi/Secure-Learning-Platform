import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TopicList = ({ courseId }) => {
  const [topics, setTopics] = useState([]);
  const { user } = useContext(AuthContext);

  const isUserTeacherOrAdmin = () => {
    return user.role === 'admin' || user.role === 'teacher';
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/courses/${courseId}/topics`, {
      withCredentials: true,
    })
    .then(response => {
      setTopics(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the topics!', error);
      toast.error('There was an error fetching the topics.');
    });
  }, [courseId]);

  const handleDelete = (topicId) => {
    if (!isUserTeacherOrAdmin()) {
      toast.error('You are not authorized to delete this topic.');
      return;
    }

    axios.delete(`http://localhost:8000/topics/${topicId}`, {
      withCredentials: true,
    })
    .then(() => {
      setTopics(topics.filter(topic => topic.id !== topicId));
      toast.success('Topic deleted successfully.');
    })
    .catch(error => {
      console.error('There was an error deleting the topic!', error);
      toast.error('There was an error deleting the topic.');
    });
  };

  return (
    <div>
      <ul className="list-group">
        {topics.map(topic => (
          <li key={topic.id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/topics/${topic.id}`}>{topic.title}</Link>
            {user && isUserTeacherOrAdmin() && (
              <button className="btn btn-danger btn-sm float-right" onClick={() => handleDelete(topic.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;
