import React, { useState } from "react";

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

const Gallery = ({ files,onUpdate }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    medicine: "",
    expiry: "",
    visit: "",
  });

  const handleEditClick = (item, index) => {
    const data = formatData(item.text);
    setEditIndex(index);
    setEditData(data);
  };

  const handleSave = (index) => {
    const item = files[index];
    const newText= `${editData.medicine} | expiry:${editData.expiry} | visit:${editData.visit}`;
    item.text=newText;
    if (onUpdate) {
      onUpdate(item._id, editData.medicine, editData.expiry,newText);
    }
    setEditIndex(null);
  };

  return (
    <div className="gallery">
      {files.map((item, index) => {
        const data = formatData(item.text);

        return (
          <div className="card" key={index}>

            <img src={item.preview} alt="upload" />

            <div className="text">
              <h4>Extracted Data</h4>

              {editIndex === index ? (
                <>
                  <input
                    value={editData.medicine}
                    onChange={(e) =>
                      setEditData({ ...editData, medicine: e.target.value })
                    }
                    placeholder="Medicine"
                  />

                  <input
                    value={editData.expiry}
                    onChange={(e) =>
                      setEditData({ ...editData, expiry: e.target.value })
                    }
                    placeholder="Expiry"
                  />

                  <input
                    value={editData.visit}
                    onChange={(e) =>
                      setEditData({ ...editData, visit: e.target.value })
                    }
                    placeholder="Next Visit"
                  />

                  <button onClick={() => handleSave(index)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Medicine:</strong> {data.medicine}</p>

                  <p style={{ color: "red" }}>
                    <strong>Expiry:</strong> {data.expiry}
                  </p>

                  <p><strong>Next Visit:</strong> {data.visit}</p>

                  <button onClick={() => handleEditClick(item, index)}>
                    Edit
                  </button>
                </>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Gallery;