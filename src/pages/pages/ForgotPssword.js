import React, { useState } from 'react';
import '../styles/forgot-password.css';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('קוד שחזור נשלח למייל או לטלפון שלך.');
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      console.error(err);
      alert('אירעה שגיאה, נסה שוב.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-password-title">שכחתי סיסמה</h2>
        <form onSubmit={handleForgotPassword} className="forgot-password-form">
          <div className="form-group">
            <label>אימייל או טלפון:</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="הזן אימייל או מספר טלפון"
              required
            />
          </div>
          <button type="submit" className="forgot-password-btn">שלח קוד שחזור</button>
        </form>
        <div className="back-to-login-link">
          <a href="/login">חזור לעמוד התחברות</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
