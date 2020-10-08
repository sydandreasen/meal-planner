import React, { useEffect, useState } from "react";
import NavMenu from "./NavMenu.js";
import MealPlanning from "./MealPlanning.js";
import Recipes from "./Recipes.js";
import Groceries from "./Groceries.js";
import Settings from "./Settings.js";
import base from "./Firebase.js";
const db = base.database();

function Dashboard(props) {
  const [defaultView, setDefaultView] = useState("");
  const [page, setPage] = useState("");
  const viewPathStr = "users/" + props.user.uid + "/settings/view";

  useEffect(() => {
    db.ref(viewPathStr).once("value", (snap) => {
      // listen to DB only once
      setDefaultView(snap.val().defaultView);
      if (
        localStorage.getItem("page") &&
        localStorage.getItem("page").length > 0
      ) {
        setPage(localStorage.getItem("page"));
      } else if (page === "") {
        setPage(snap.val().defaultPage);
      }
    });
  });

  return (
    <div>
      <NavMenu
        page={(showPage) => {
          setPage(showPage);
          localStorage.setItem("page", showPage);
        }}
        selected={page}
      />
      {page === "meal planning" ? (
        <MealPlanning defaultView={defaultView} uid={props.user.uid} />
      ) : page === "recipes" ? (
        <Recipes />
      ) : page === "groceries" ? (
        <Groceries />
      ) : page === "settings" ? (
        <Settings uid={props.user.uid} />
      ) : (
        ""
      )}
    </div>
  );
}

export default Dashboard;
