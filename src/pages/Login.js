// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await fetch('https://israel-navy-test.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
        timeout: 10000,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        navigate(`/tasks/${data.userId}`);
      } else {
        const errorData = await response.json();
        setError(`Login error: ${errorData.error}`);
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">התחברות</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>אימייל :</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="הזן אימייל"
              required
            />
          </div>
          <div className="form-group">
            <label>סיסמה:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הזן סיסמה"
              required
            />
          </div>
          <button type="submit" className="login-btn">התחבר</button>
        </form>
        <div className="forgot-password-link">
          <a href="/ForgotPassword">שכחתי סיסמה</a>
        </div>
      </div>
    </div>
  );
};

export default Login;