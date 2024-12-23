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
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: identifier,
          password
        })
      });

      // ראשית נבדוק אם יש תוכן בתשובה
      const text = await response.text();
      let data;
      
      try {
        // ננסה לפרסר את התוכן כ-JSON רק אם יש תוכן
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('Failed to parse response:', text);
        throw new Error('תשובה לא תקינה מהשרת');
      }

      if (!response.ok) {
        throw new Error(data.error || 'שם משתמש או סיסמה שגויים');
      }

      if (!data.userId) {
        throw new Error('חסר מזהה משתמש בתשובה מהשרת');
      }

      // אם הגענו לכאן, יש לנו userId תקין
      navigate(`/users/tasks/${data.userId}`);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'שגיאת התחברות, אנא נסה שוב');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">התחברות</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>אימייל:</label>
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