import React, { useRef, useState } from "react";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import Home from "./components/Home";   // ✅ HERE
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState("home");
  const inputRef = useRef();

  // Handle Upload
  const handleUpload = (newFiles) => {
    const mapped = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      text: "Processing..."
    }));

    setFiles((prev) => [...prev, ...mapped]);

    // Dummy OCR (replace with backend later)
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((item) => ({
          ...item,
          text: "Paracetamol 500mg | Expiry: 2026 | Next Visit: 12 May"
        }))
      );
    }, 1000);

    // Switch to Uploads tab automatically
    setView("uploads");
  };

  return (
  <div>
    {/* Hidden file input */}
    <input
      type="file"
      multiple
      ref={inputRef}
      style={{ display: "none" }}
      onChange={(e) => handleUpload(Array.from(e.target.files))}
    />

    {/* HEADER */}
    <Header
      onUploadClick={() => inputRef.current.click()}
      setView={setView}
      currentView={view}
    />

    {/* VIEWS */}
    {view === "home" && (
      <Home onGetStarted={() => setView("upload")} />
    )}

    {view === "upload" && (
      <div className="upload-box">
        <p>Click + to upload images</p>
      </div>
    )}

    {view === "uploads" && <Gallery files={files} />}
  </div>
);
}

export default App;