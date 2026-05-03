import React, { useRef, useState } from "react";

const UploadBox = ({ onUpload }) => {
  const inputRef = useRef();
  const [files, setFiles] = useState([]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);

    const mapped = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles(mapped);
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    onUpload(files.map((f) => f.file));
    setFiles([]);
  };

  return (
    <div className="upload-box">

      {/* HIDDEN INPUT */}
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleSelect}
      />

      {/* MAIN BUTTON */}
      <button onClick={() => inputRef.current.click()}>
        📷 Add Prescription Images
      </button>

      {/* PREVIEW */}
      {files.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <p style={{ fontSize: "13px", color: "#64748b" }}>
            Selected Images ({files.length})
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {files.map((img, i) => (
              <img
                key={i}
                src={img.preview}
                width={80}
                height={80}
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "1px solid #e5e7eb",
                }}
              />
            ))}
          </div>

          {/* UPLOAD BUTTON */}
          <button
            onClick={handleUpload}
            style={{
              marginTop: "15px",
              padding: "10px 15px",
              background: "#0ea5a4",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Upload Prescription
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadBox;