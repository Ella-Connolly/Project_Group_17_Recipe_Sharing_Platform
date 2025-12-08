const express = require("express");
const router = express.Router();
const db = require("../db");
const requireLogin = require("../middleware/requireLogin");

// LIST / FILTER RECIPES
router.get("/", async (req, res) => {
  const { cuisine, ingredient, keyword } = req.query;

  let query = "SELECT * FROM recipes WHERE 1=1";
  const params = [];

  if (cuisine) {
    params.push(cuisine);
    query += ` AND cuisine ILIKE $${params.length}`;
  }

  if (ingredient) {
    params.push(`%${ingredient}%`);
    query += ` AND ingredients::text ILIKE $${params.length}`;
  }

  if (keyword) {
    params.push(`%${keyword}%`);
    query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }

  query += " ORDER BY created_at DESC";

  try {
    const result = await db.query(query, params);
    res.render("pages/recipes", {
      recipes: result.rows,
      flash: req.flash ? req.flash() : {},
      currentUser: req.session.user || null,
    });
  } catch (err) {
    console.error("Recipe filter error:", err);
    req.flash("error", "Could not load recipes.");
    res.redirect("/");
  }
});

// POST NEW RECIPE
router.post("/", requireLogin, async (req, res) => {
  let {
    title, description, ingredients, instructions, tags,
    cuisine, difficulty, cook_time, prep_time, servings, images
  } = req.body;

  // Convert comma-separated strings into arrays for storage
  ingredients = ingredients ? ingredients.split(",").map(i => i.trim()) : [];
  instructions = instructions ? instructions.split(".").map(i => i.trim()).filter(Boolean) : [];
  tags = tags ? tags.split(",").map(t => t.trim()) : [];
  images = images ? [images.trim()] : []; // wrap single image URL in array

  try {
    const result = await db.query(
      `INSERT INTO recipes
      (title, description, ingredients, instructions, tags, cuisine, difficulty, cook_time, prep_time, servings, images, author_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        title,
        description || "",
        ingredients,
        instructions,
        tags,
        cuisine || "",
        difficulty || "",
        cook_time || 0,
        prep_time || 0,
        servings || 1,
        images,
        req.session.user.id
      ]
    );

    // Redirect to newly created recipe page instead of JSON
    const newRecipe = result.rows[0];
    res.redirect(`/recipes/${newRecipe.id}`);
  } catch (err) {
    console.error("Recipe post error:", err);
    req.flash("error", "Could not submit recipe. Please try again.");
    res.redirect("/recipes/submit");
  }
});

router.get("/submit", requireLogin, (req, res) => {
  res.render("pages/submit"); // this loads views/submit.ejs
});


// DELETE RECIPE BY ID
router.delete("/:id", requireLogin, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.session.user.id;

  try {
    const check = await db.query("SELECT author_id FROM recipes WHERE id = $1", [recipeId]);

    if (!check.rows.length) return res.status(404).json({ error: "Recipe not found" });
    if (check.rows[0].author_id !== userId) return res.status(403).json({ error: "Not allowed" });

    await db.query("DELETE FROM recipes WHERE id = $1", [recipeId]);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// VIEW SINGLE RECIPE
// Must come after POST "/" to avoid conflicts
router.get("/:id", async (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) return res.status(400).send("Invalid recipe ID");

  try {
    const recipeResult = await db.query(
      `SELECT r.*, u.username AS author_username
       FROM recipes r
       LEFT JOIN users u ON r.author_id = u.id
       WHERE r.id = $1`,
      [recipeId]
    );

    if (!recipeResult.rows.length) return res.status(404).send("Recipe not found");

    const recipe = recipeResult.rows[0];

    // Convert strings to arrays
    if (typeof recipe.ingredients === "string") {
      recipe.ingredients = recipe.ingredients.split(",").map(i => i.trim());
    }
    if (typeof recipe.instructions === "string") {
      recipe.instructions = recipe.instructions.split(".").map(i => i.trim()).filter(Boolean);
    }

    const commentsResult = await db.query(
      `SELECT c.*, u.username AS commenter_username
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.recipe_id = $1
       ORDER BY c.created_at DESC`,
      [recipeId]
    );

    res.render("pages/recipedetail", {
      recipe,
      comments: commentsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;
