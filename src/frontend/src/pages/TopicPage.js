import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ForumPostList from '../components/ForumPostList';
import ForumPostForm from '../components/ForumPostForm';

const TopicPage = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState({});
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:8000/topics/${topicId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setTopic(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the topic!', error);
    });

    axios.get(`http://localhost:8000/topics/${topicId}/forum_posts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setPosts(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the forum posts!', error);
    });
  }, [topicId]);

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.content}</p>
      <ForumPostList topicId={topicId} posts={posts} setPosts={setPosts} />
      {user && <ForumPostForm topicId={topicId} setPostList={setPosts} />}
    </div>
  );
};

export default TopicPage;
