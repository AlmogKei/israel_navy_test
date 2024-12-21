import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const API_URL = 'https://israel-navy-test.onrender.com';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('יש להזין אימייל וסיסמה');
      return;
    }

    try {
      const response = await fetch('${API_URL}/users/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: identifier, 
          password 
        })
      });

      console.log('Response status:', response.status);

      if (response.status === 200 || response.status === 201) {
        // בדיקה אם יש תוכן בתגובה
        try {
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          
          if (data.userId) {
            navigate(`/tasks/${data.userId}`);
          } else {
            window.location.href = '${API_URL}/tasks/1';
          }
        } catch (parseError) {
          // אם אין JSON תקין, ננסה ניווט ברירת מחדל
          window.location.href = '${API_URL}/tasks/1';
        }
      } else {
        setError('שם משתמש או סיסמה שגויים');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('שגיאת התחברות, אנא נסה שוב');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">התחברות</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>אימייל :</label>
            <input
              type="email"
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
          <a href="/">שכחתי סיסמה</a>
        </div>
      </div>
    </div>
  );
};

export default Login;