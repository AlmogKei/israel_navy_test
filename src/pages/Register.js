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
  
    if (password !== confirmPass) {
        setError('הסיסמאות אינן תואמות');
        return;
    }

    try {
        const response = await fetch('https://israel-navy-test.onrender.com/users/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                fullName,  // שים לב שהשארתי את השם המקורי כפי שהוא בקוד שלך
                email, 
                phone, 
                password 
            })
        });

        // אם הסטטוס הוא 200 והתגובה ריקה, זה אומר שההרשמה הצליחה
        if (response.status === 200) {
            console.log('Registration successful');
            alert('נרשמת בהצלחה!');
            // ניווט לדף ההתחברות
            window.location.href = '/users/login';
            return;
        }

        // אם הגענו לכאן ויש תוכן, ננסה לפרסר אותו
        const responseText = await response.text();
        if (responseText) {
            const data = JSON.parse(responseText);
            if (!response.ok) {
                setError(data.message || 'שגיאה ברישום');
            }
        } else {
            if (!response.ok) {
                setError('שגיאה ברישום');
            }
        }

    } catch (err) {
        console.error('Error:', err);
        setError('שגיאה בתהליך ההרשמה. אנא נסה שוב.');
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
