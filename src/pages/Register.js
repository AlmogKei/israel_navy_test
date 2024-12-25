import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [phone, setPhone] = useState('');

  // send the details to the docker server
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://israel-navy-server.onrender.com/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password, confirmPass }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
      } else {
        const error = await response.json();
        console.error('Error:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">הרשמה</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="fullName">שם מלא:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="הקלד/י את שמך המלא"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">מספר טלפון:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="הקלד/י מספר טלפון"
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="password">סיסמה:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הקלד/י סיסמה"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPass">אישור סיסמה:</label>
            <input
              type="password"
              id="confirmPass"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="הקלד/י שוב את הסיסמה"
              required
            />
          </div>

          <button type="submit" className="btn register-btn">הרשמה</button>
        </form>
        <p className="login-link">
          כבר רשום/ה? <Link to="/users/login">התחבר/י כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
