// import React and useState hook
import React, { useState } from "react";

// import axios instance for API requests
import api from "../api/axiosInstance";

// import recipe card component to display results
import RecipeCard from "../components/RecipeCard";

export default function Search() {
  // create state to store search text
  const [query, setQuery] = useState("");

  // create state to store search results
  const [results, setResults] = useState([]);

  // function that triggers when clicking "Search"
  const handleSearch = async () => {
    // send GET request with query as URL parameter
    const res = await api.get("/recipes/search", {
      params: { q: query }
    });

    // store returned recipe list in results
    setResults(res.data);
  };

  return (
    <div>
      {/* input field for the search bar */}
      <input
        // bind text input to query state
        value={query}

        // update query state when user types
        onChange={(e) => setQuery(e.target.value)}

        // placeholder text
        placeholder="Search by ingredient, cuisine, dietary restriction, or keyword"
      />

      {/* button to trigger search */}
      <button onClick={handleSearch}>Search</button>

      {/* container to display recipe cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* loop through search results and display each card */}
        {results.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
