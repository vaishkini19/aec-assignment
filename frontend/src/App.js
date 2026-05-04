import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import Home from "./components/Home";   
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState("home");
  const inputRef = useRef();

  // 👇 ADD HERE
  useEffect(() => {
    fetch("/api/test")
      .then(res => res.json())
      .then(data => console.log("FROM BACKEND:", data))
      .catch(err => console.log("Error:", err));
  }, []);

  // Handle Upload
  const handleUpload = async (newFiles) => {
  const mapped = newFiles.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    text: "Processing..."
  }));

  setFiles((prev) => [...prev, ...mapped]);

  const formData = new FormData();

  newFiles.forEach((file) => {
    formData.append("prescriptions", file); // ✅ important
  });
  formData.append("email", "anvitha2010050@gmail.com");
  try {
    const res = await fetch("/api/medicines/upload", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    setFiles((prev) =>
      prev.map((item) => ({
        ...item,
        _id: result.data._id,
        text: result.extractedText || "No data found"
      }))
    );

  } catch (err) {
    console.error("Upload error:", err);
  }

  setView("uploads");
};
const handleUpdateMedicine = async (id, updatedText,updatedDate,fullText) => {
  try {
    const res = await fetch(`/api/medicines/verify-medicine/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: updatedText,expiryDate: updatedDate })
    });

    if (res.ok) {
      // If DB update is successful, update the UI state
      setFiles((prev) =>
        prev.map((item) => (item._id === id ? { ...item, text: fullText } : item))
      );
      console.log("Database updated successfully!");
    }
  } catch (err) {
    console.error("Failed to update database:", err);
  }
};
const handleDeleteMedicine = async (id) => {
  // Optional: Add a confirmation dialog
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    const res = await fetch(`/api/medicines/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove the item from the 'files' state so it disappears from the Gallery
      setFiles((prev) => prev.filter((item) => item._id !== id));
      console.log("Deleted from DB and UI");
    } else {
      console.error("Failed to delete from server");
    }
  } catch (err) {
    console.error("Network error during deletion:", err);
  }
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

    {view === "uploads" && <Gallery files={files}
    onUpdate={handleUpdateMedicine}
    onDelete={handleDeleteMedicine}  />}
  </div>
);
}

export default App;