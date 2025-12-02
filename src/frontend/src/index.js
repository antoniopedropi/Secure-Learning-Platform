import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {AuthProvider} from './AuthContext';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';

// Configuração do Axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Criar root para React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar o aplicativo
root.render(
    <BrowserRouter>
        <AuthProvider>
            <ToastContainer />
            <App />
        </AuthProvider>
    </BrowserRouter>
);
