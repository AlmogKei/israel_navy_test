import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <div className="content">
          <h1 className="title">ברוכים הבאים לאפליקציית To-Do-List</h1>
          <p className="subtitle">נהל את המשימות שלך מכל מקום ובכל זמן</p>
          <div className="button-section">
            <Link to="/users/login" className="btn primary-btn">התחברות</Link>
            <Link to="/users/register" className="btn secondary-btn">הרשמה</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
