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

    try {
      const loginUrl = `${API_URL}/users/login`;
      console.log('Sending request to:', loginUrl);

      const requestData = {
        email: identifier,
        password
      };
      console.log('Request data:', { email: requestData.email });

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      // קריאת התשובה כטקסט
      const text = await response.text();
      console.log('Raw response:', text);

      // אם אין תוכן
      if (!text) {
        console.error('Empty response received');
        throw new Error('לא התקבלה תשובה מהשרת');
      }

      // ניסיון לפרסר את התשובה
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('Parse error:', e);
        throw new Error('תשובה לא תקינה מהשרת');
      }

      // בדיקת שגיאות
      if (response.status >= 400) {
        throw new Error(data.error || 'שגיאת התחברות');
      }

      // בדיקת מזהה משתמש
      if (!data.id) {
        throw new Error('חסר מזהה משתמש בתשובה מהשרת');
      }

      // ניווט למסך המשימות
      navigate(`/users/tasks/${data.id}`);

    } catch (error) {
      console.error('Login error:', error);
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