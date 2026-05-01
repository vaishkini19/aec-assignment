import React from "react";

const Header = ({ onUploadClick, setView, currentView }) => {
  return (
    <div className="header">
      <h2 className="logo">MedVault</h2>

      <div className="nav">
        <button
          onClick={() => setView("upload")}
          className={currentView === "upload" ? "active" : ""}
        >
          Upload
        </button>

        <button
          onClick={() => setView("uploads")}
          className={currentView === "uploads" ? "active" : ""}
        >
          Uploads
        </button>
      </div>

      {/* ONLY upload trigger */}
      <button className="plus-btn" onClick={onUploadClick}>
        +
      </button>
    </div>
  );
};

export default Header;