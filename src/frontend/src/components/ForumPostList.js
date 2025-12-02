import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForumPostList = ({ topicId, posts, setPosts }) => {
  const handleDelete = (postId) => {
    axios.delete(`http://localhost:8000/forum_posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      setPosts(posts.filter(post => post.id !== postId));
    })
    .catch(error => {
      console.error('There was an error deleting the forum post!', error);
    });
  };

  const renderAttachment = (post) => {
    if (post.image_path) {
      const fileExtension = post.image_path.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
      if (isImage) {
        return (
          <a href={`http://localhost:8000/${post.image_path}`} target="_blank" rel="noopener noreferrer">
            <img src={`http://localhost:8000/${post.image_path}`} alt="Attachment" className="img-fluid" style={{ maxHeight: '200px' }} />
          </a>
        );
      } else {
        return (
          <a href={`http://localhost:8000/${post.image_path}`} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <h2>Forum Posts</h2>
      <ul className="list-group">
        {posts.map(post => (
          <li key={post.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{post.user.username}</strong>
                <br />
                <small className="text-muted">{new Date(post.created_at).toLocaleString()}</small>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>
                <i className="fas fa-times"></i> {/* Usar um ícone do FontAwesome para a cruz */}
              </button>
            </div>
            <div className="mt-3">
              <p>{post.content}</p>
              {renderAttachment(post)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumPostList;
