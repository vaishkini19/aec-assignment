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

const MedicineCard = ({ item }) => {
  const data = formatData(item.text);

  const images =
    item.images && item.images.length > 0
      ? item.images
      : item.preview
      ? [{ preview: item.preview }]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="card">

      {/* AI HEADER */}
      <div style={{
        marginBottom: "10px",
        padding: "8px 10px",
        background: "#f1f5f9",
        borderRadius: "10px",
        fontSize: "12px",
        color: "#334155"
      }}>
        🧠 AI Analyzed Medicine Record
      </div>

      {/* IMAGE VIEWER */}
      <div className="image-stack" style={{ position: "relative" }}>

        {images.length > 0 && (
          <img
            src={images[activeIndex]?.preview}
            alt="medicine"
            style={{
              width: "100%",
              height: "170px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        )}

        {/* LEFT */}
        {images.length > 1 && (
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            style={btnStyleLeft}
          >
            ‹
          </button>
        )}

        {/* RIGHT */}
        {images.length > 1 && (
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
            style={btnStyleRight}
          >
            ›
          </button>
        )}

        {/* DOTS */}
        {images.length > 1 && (
          <div style={dotsContainer}>
            {images.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === activeIndex ? "#0ea5a4" : "#cbd5f5",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="text">

        <p>
          <strong>Medicine:</strong>{" "}
          <span style={{ fontWeight: 600, color: "#0f172a" }}>
            {data.medicine || "Unknown"}
          </span>
        </p>

        <p>
          <strong>Expiry:</strong>{" "}
          <span style={{ color: "#dc2626", fontWeight: 600 }}>
            {data.expiry || "Not detected"}
          </span>
        </p>

        <p>
          <strong>Next Visit:</strong>{" "}
          {data.visit || "Not available"}
        </p>

      </div>
    </div>
  );
};

const btnStyleLeft = {
  position: "absolute",
  left: 8,
  top: "45%",
  background: "rgba(0,0,0,0.4)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 28,
  height: 28,
  cursor: "pointer",
};

const btnStyleRight = {
  position: "absolute",
  right: 8,
  top: "45%",
  background: "rgba(0,0,0,0.4)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 28,
  height: 28,
  cursor: "pointer",
};

const dotsContainer = {
  position: "absolute",
  bottom: 8,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: "5px",
};

export default MedicineCard;