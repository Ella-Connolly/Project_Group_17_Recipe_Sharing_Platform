// import React
import React from "react";

export default function SaveRecipeButton({ isSaved, onSave }) {
  return (
    // save button
    <button
      onClick={onSave}
      style={{
        background: isSaved ? "#4caf50" : "#ff9800",
        color: "white",
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      {/* change text based on state */}
      {isSaved ? "Saved ✓" : "Save Recipe"}
    </button>
  );
}
