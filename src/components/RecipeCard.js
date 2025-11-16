// import React library
import React from "react";

// import Link for navigation to recipe detail page
import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    // wrapper box for each card
    <div style={{ border: "1px solid #ccc", width: "260px", padding: "10px" }}>

      {/* display recipe image */}
      <img
        src={recipe.images?.[0]}
        alt={recipe.title}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />

      {/* display title */}
      <h3>{recipe.title}</h3>

      {/* display cuisine */}
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>

      {/* display difficulty */}
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

      {/* link to view recipe details */}
      <Link to={`/recipe/${recipe._id}`}>View Recipe</Link>
    </div>
  );
}
