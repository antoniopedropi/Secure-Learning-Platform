import React from 'react';
import {Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CourseForm from './components/CourseForm';
import CoursePage from './pages/CoursePage';
import TopicForm from './components/TopicForm';
import TopicPage from './pages/TopicPage';
import StudentPage from './pages/StudentPage';
import UserForm from './components/UserForm';
import Layout from './components/Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/courses/new" element={<CourseForm isCreating={true}/>} />
        <Route path="/courses/:courseId/edit" element={<CourseForm />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/courses/:courseId/topics/new" element={<TopicForm isCreating={true} />} />
        <Route path="/topics/:topicId/edit" element={<TopicForm isCreating={false} />} />
        <Route path="/topics/:topicId" element={<TopicPage />} />
        <Route path="/me" element={<StudentPage />} />
        <Route path="/admin/users/new" element={<UserForm isCreating={true} />} />
        <Route path="/admin/users/:userId/edit" element={<UserForm isCreating={false} />} />
      </Routes>
    </Layout>
  );
};

export default App;
