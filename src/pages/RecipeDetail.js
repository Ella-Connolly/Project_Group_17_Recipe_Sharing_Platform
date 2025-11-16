// import React + hooks
import React, { useEffect, useState } from "react";

// import axios instance
import api from "../api/axiosInstance";

// import rating & save components
import StarRating from "../components/StarRating";
import SaveRecipeButton from "../components/SaveRecipeButton";

export default function RecipeDetail({ recipeId }) {
  // store recipe details
  const [recipe, setRecipe] = useState(null);

  // store saved status
  const [isSaved, setIsSaved] = useState(false);

  // load recipe + save status on mount
  useEffect(() => {
    async function loadRecipe() {
      // fetch recipe data
      const res = await api.get(`/recipes/${recipeId}`);
      setRecipe(res.data);

      // fetch saved recipes for user
      const savedRes = await api.get("/users/me/saved");
      setIsSaved(savedRes.data.includes(recipeId));
    }
    loadRecipe();
  }, [recipeId]);

  // handle clicking "Save Recipe"
  const handleSave = async () => {
    await api.post(`/recipes/${recipeId}/save`);
    setIsSaved(true);
  };

  // loading state
  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      {/* title */}
      <h1>{recipe.title}</h1>

      {/* recipe image */}
      <img src={recipe.images?.[0]} width="300" alt={recipe.title} />

      {/* cook time + difficulty */}
      <p><strong>Cook Time:</strong> {recipe.cookTime} min</p>
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

      {/* save recipe button */}
      <SaveRecipeButton isSaved={isSaved} onSave={handleSave} />

      {/* star rating */}
      <StarRating recipeId={recipeId} currentAverage={recipe.avgRating} />

      {/* ingredients list */}
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* instructions */}
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
}
