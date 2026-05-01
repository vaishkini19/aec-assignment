import React, { useRef } from "react";

const UploadBox = ({ onUpload }) => {
  const inputRef = useRef();

  return (
    <div className="upload-box">
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => onUpload(Array.from(e.target.files))}
      />

      <button onClick={() => inputRef.current.click()}>
        Upload Images
      </button>
    </div>
  );
};

export default UploadBox;