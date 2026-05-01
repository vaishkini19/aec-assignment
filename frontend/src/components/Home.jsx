import React from "react";
import "./Home.css";

const Home = ({ onGetStarted }) => {
  return (
    <div className="home">

      {/* HERO */}
      <div className="hero">
        <h1>MedVault</h1>
        <p>Securely store and manage your medical records</p>

        <button className="start-btn" onClick={onGetStarted}>
          Get Started
        </button>
      </div>

      {/* INFO */}
      <div className="info">
        <h2>All Your Medical Records in One Place</h2>
        <p>Upload, organize and access prescriptions anytime, anywhere</p>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-box">
          <h3>1000+</h3>
          <p>Documents Stored</p>
        </div>

        <div className="stat-box">
          <h3>500+</h3>
          <p>Active Users</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <h3>Quick Access</h3>

        <div className="action-grid">
          <div className="action-card">Prescriptions</div>
          <div className="action-card">Reports</div>
          <div className="action-card">Scans</div>
        </div>
      </div>

    </div>
  );
};

export default Home;