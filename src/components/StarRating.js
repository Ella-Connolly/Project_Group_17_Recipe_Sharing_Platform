// import React, useState
import React, { useState } from "react";

// import axios instance to submit rating
import api from "../api/axiosInstance";

export default function StarRating({ recipeId, currentAverage }) {
  // track hovered star
  const [hovered, setHovered] = useState(0);

  // track user's rating selection
  const [rating, setRating] = useState(0);

  // submit rating to backend
  const submitRating = async (value) => {
    // store selected rating in local state
    setRating(value);

    // send rating to API endpoint
    await api.post(`/recipes/${recipeId}/rate`, { rating: value });
  };

  return (
    <div>
      {/* show average rating */}
      <p>Average Rating: ⭐ {currentAverage || 0}</p>

      {/* show 5 stars */}
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}

          // add pointer cursor
          style={{ fontSize: "25px", cursor: "pointer", color: "#ff9800" }}

          // when hovering over stars
          onMouseEnter={() => setHovered(star)}

          // stop hovering
          onMouseLeave={() => setHovered(0)}

          // submit rating when clicked
          onClick={() => submitRating(star)}
        >
          {/* fill star if selected or hovered */}
          {star <= (hovered || rating) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
