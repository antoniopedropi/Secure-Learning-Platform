import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/')
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Learning Platform</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user && user.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin Panel</Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="navbar-text">Hello, {user.username}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
