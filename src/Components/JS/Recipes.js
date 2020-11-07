import React from "react";
import { Button } from "antd";
import "../SCSS/Recipes.scss";
import { RecipeCard } from "./Recipe.js";

// beginning framework for Recipes page; fill out with more API freedom
function Recipes(props) {
  // example
  const recipeKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="recipe-page">
      <h1>Welcome to your Recipe Dashboard</h1>
      <div className="button-wrapper row">
        <Button type="primary">Import New</Button>
        <Button type="primary">Add Manually</Button>
      </div>

      <div className="recipe-wrapper">
        {recipeKeys.map((key) => (
          <RecipeCard key={key} />
        ))}
      </div>
    </div>
  );
}

export default Recipes;
