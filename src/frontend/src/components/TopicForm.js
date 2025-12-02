import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';

const TopicForm = ({ isCreating }) => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [state, setState] = useState('draft');
  const [visibility, setVisibility] = useState('private');

  useEffect(() => {
    if (topicId && !isCreating) {
      axios.get(`http://localhost:8000/topics/${topicId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setState(response.data.state);
        setVisibility(response.data.visibility);
      })
      .catch(error => {
        console.error('There was an error fetching the topic!', error);
      });
    }
  }, [topicId, isCreating]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { title, content, state, visibility };
    const url = isCreating ? `http://localhost:8000/courses/${courseId}/topics/` : `http://localhost:8000/topics/${topicId}`;
    const method = isCreating ? 'post' : 'put';
    axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      toast.success(`${isCreating ? 'Created' : 'Updated'} topic successfully!`);
      navigate(`/courses/${courseId}`);
    })
    .catch(error => {
      console.error('There was an error saving the topic!', error);
      toast.error('There was an error saving the topic.');
    });
  };

  return (
    <div className="container mt-4">
      <h2>{isCreating ? 'Create New Topic' : 'Edit Topic'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <div className="form-group">
          <label>State:</label>
          <select className="form-control" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="form-group">
          <label>Visibility:</label>
          <select className="form-control" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{isCreating ? 'Create' : 'Update'} Topic</button>
      </form>
    </div>
  );
};

export default TopicForm;
