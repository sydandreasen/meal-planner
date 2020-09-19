import React, { useState } from "react";
import NavMenu from "./NavMenu.js";
import MealPlanning from "./MealPlanning.js";
import Recipes from "./Recipes.js";
import Groceries from "./Groceries.js";

function Dashboard(props) {
  const [page, setPage] = useState("meal planning");

  return (
    <div>
      <NavMenu page={(showPage) => setPage(showPage)} />
      {page === "meal planning" ? (
        <MealPlanning />
      ) : page === "recipes" ? (
        <Recipes />
      ) : page === "groceries" ? (
        <Groceries />
      ) : (
        ""
      )}
    </div>
  );
}

export default Dashboard;
