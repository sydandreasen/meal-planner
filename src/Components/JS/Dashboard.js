import React, { useEffect, useState } from "react";
import NavMenu from "./NavMenu.js";
import MealPlanning from "./MealPlanning.js";
import Recipes from "./Recipes.js";
import Groceries from "./Groceries.js";
import Settings from "./Settings.js";
import DbHandler from "./DbHandler.js";
import * as firebase from "firebase/app";
require("firebase/database");
const db = firebase.database();

function Dashboard(props) {
  const [defaultView, setDefaultView] = useState("");
  const [page, setPage] = useState("");
  const viewPathStr = "users/" + props.user.uid + "/settings/view";

  useEffect(() => {
    db.ref(viewPathStr).once("value", (snap) => {
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
  }, [props.user.uid]);

  DbHandler(props.user);
  return (
    <div>
      <NavMenu
        page={(showPage) => {
          setPage(showPage);
          localStorage.setItem("page", showPage);
        }}
      />
      {page === "meal planning" ? (
        <MealPlanning defaultView={defaultView} />
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
