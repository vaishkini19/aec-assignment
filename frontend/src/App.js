import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import Home from "./components/Home";  
import Login from "./components/Login"; // ✅ HERE
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState("home");
  const inputRef = useRef();
  const [loggedIn, setLoggedIn]=useState(false);



  // 👇 ADD HERE
  useEffect(() => {
    fetch("http://localhost:5000/api/test")
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

  try {
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setFiles((prev) =>
      prev.map((item, index) => ({
        ...item,
        text: data[index]?.text || "No data found"
      }))
    );

  } catch (err) {
    console.error("Upload error:", err);
  }

  setView("uploads");
};
if(!loggedIn){
  return <Login onLogin={()=>
    setLoggedIn(true)}/>
  }


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