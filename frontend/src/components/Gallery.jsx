import React from "react";

const formatData = (text) => {
  if (!text) return {};

  const parts = text.split("|");

  let medicine = "";
  let expiry = "";
  let visit = "";

  parts.forEach((part) => {
    if (part.toLowerCase().includes("expiry")) {
      expiry = part.split(":")[1]?.trim();
    } else if (part.toLowerCase().includes("visit")) {
      visit = part.split(":")[1]?.trim();
    } else {
      medicine = part.trim();
    }
  });

  return { medicine, expiry, visit };
};

const Gallery = ({ files }) => {
  return (
    <div className="gallery">
      {files.map((item, index) => {
        const data = formatData(item.text);

        return (
          <div className="card" key={index}>
            <img src={item.preview} alt="upload" />

            <div className="text">
              <h4>Extracted Data</h4>

              <p><strong>Medicine:</strong> {data.medicine}</p>

              <p style={{ color: "red" }}>
                <strong>Expiry:</strong> {data.expiry}
              </p>

              <p><strong>Next Visit:</strong> {data.visit}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;