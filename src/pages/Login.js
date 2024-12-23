// Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const API_URL = 'https://israel-navy-test.onrender.com';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (password !== confirmPass) {
        setError('הסיסמאות אינן תואמות');
        return;
      }

      console.log('Attempting to register with:', { email, fullName, phone });

      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          fullName,
          phone,
          password
        })
      });

      const text = await response.text();
      console.log('Server response:', text);

      if (!response.ok) {
        throw new Error(text || 'שגיאה בהרשמה');
      }

      alert('נרשמת בהצלחה!');
      navigate('/users/login');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'שגיאה בהרשמה');
    }
  };

  // ... שאר הקוד של ה-render נשאר זהה

};

// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const API_URL = 'https://israel-navy-test.onrender.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Attempting login with:', { email });

      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const text = await response.text();
      console.log('Server response:', text);

      if (!response.ok) {
        throw new Error('שם משתמש או סיסמה שגויים');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Failed to parse response:', text);
        throw new Error('תשובה לא תקינה מהשרת');
      }

      console.log('Parsed login response:', data);

      if (data.id) {
        navigate(`/users/tasks/${data.id}`);
      } else {
        throw new Error('חסר מזהה משתמש בתשובה מהשרת');
      }

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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