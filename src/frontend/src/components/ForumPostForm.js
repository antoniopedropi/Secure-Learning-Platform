import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForumPostForm = ({ topicId, setPostList }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);  // Estado para armazenar o arquivo
  const { user } = useContext(AuthContext);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);  // Atualiza o estado com o arquivo selecionado
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain'  // Tipos de arquivos aceitos
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('content', content);  // Adiciona o conteúdo ao FormData
    if (file) {
      formData.append('file', file);  // Adiciona o arquivo ao FormData
    }

    axios.post(`http://localhost:8000/topics/${topicId}/forum_posts/`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setPostList(prev => [...prev, response.data]);
      toast.success('Post created successfully!');
      setContent('');
      setFile(null);  // Limpa o campo de arquivo após o upload
    })
    .catch(error => {
      console.error('There was an error creating the post!', error);
      toast.error('There was an error creating the post.');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-group">
        <label>Content:</label>
        <textarea className="form-control" rows="3" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
      </div>
      <div className="form-group">
        <label>File:</label>
        <div {...getRootProps({ className: 'dropzone border rounded p-4 text-center' })}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop an image or document here, or click to select one (allowed: jpg, jpeg, png, gif, txt ,pdf ,docx)</p>
          }
          {file && <p>Selected file: {file.name}</p>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3">Create Post</button>
    </form>
  );
};

export default ForumPostForm;
