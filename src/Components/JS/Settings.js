import React, { useState, useEffect } from "react";
import { Select, InputNumber } from "antd";
import DbHandler from "./DbHandler";
import * as firebase from "firebase/app";
import "../SCSS/Settings.scss";
require("firebase/database");
const db = firebase.database();
const { Option } = Select;

function Settings(props) {
  const settingsPathStr = "users/" + props.uid + "/settings";
  const [DbSettings, setDbSettings] = useState({});
  useEffect(() => {
    db.ref(settingsPathStr).on("value", (snapshot) => {
      setDbSettings(snapshot.val());
    });
  }, [props.uid]);

  return DbSettings &&
    DbSettings.view &&
    DbSettings.goals &&
    DbSettings.meals ? (
    <div className="settings">
      <h1>Customize your Account Settings</h1>
      <h2>Views</h2>
      <div className="setting">
        <h3>Set which page appears upon login :</h3>
        <Select
          style={{ margin: "10px" }}
          defaultValue={DbSettings.view.defaultPage} // query from current settings
          onChange={(value) =>
            db.ref(settingsPathStr + "/view").update({ defaultPage: value })
          } // write to db
        >
          <Option value={"meal planning"}>Meal Planning</Option>
          <Option value={"recipes"}>Recipes</Option>
          <Option value={"groceries"}>Groceries</Option>
        </Select>
      </div>
      <div className="setting">
        <h3>
          Within the meal planning page, set which layout appears by default :
        </h3>
        <Select
          style={{ margin: "10px" }}
          defaultValue={DbSettings.view.defaultView} // query from current settings
          onChange={(value) =>
            db.ref(settingsPathStr + "/view").update({ defaultView: value })
          } // write to db
        >
          <Option value={"monthly"}>Monthly View</Option>
          <Option value={"weekly"}>Weekly View</Option>
          <Option value={"daily"}>Daily View</Option>
        </Select>
      </div>

      <br />
      <h2>Daily Nutritional Goals</h2>

      <h3>
        Set up your goals for daily nutrition to make planning healthy meals a
        breeze :
      </h3>
      <div className="setting">
        <h4>Calories</h4>
        <InputNumber
          style={{ margin: "10px" }}
          defaultValue={DbSettings.goals.calories.amount} // query from current settings
          // onChange={} // write to DB, TODO
        />
      </div>
      <div className="setting">
        <h4>Carbohydrates ({DbSettings.goals.carbohydrates.unit})</h4>
        <InputNumber
          style={{ margin: "10px" }}
          defaultValue={DbSettings.goals.carbohydrates.amount} // query from current settings
          // onChange={} // write to DB, TODO
        />
      </div>
      <div className="setting">
        <h4>Protein ({DbSettings.goals.protein.unit})</h4>
        <InputNumber
          style={{ margin: "10px" }}
          defaultValue={DbSettings.goals.protein.amount} // query from current settings
          // onChange={} // write to DB, TODO
        />
      </div>
      <div className="setting">
        <h4>Fat ({DbSettings.goals.fat.unit})</h4>
        <InputNumber
          style={{ margin: "10px" }}
          defaultValue={DbSettings.goals.fat.amount} // query from current settings
          // onChange={} // write to DB, TODO
        />
      </div>
      <div className="setting">
        <h4>Sugar ({DbSettings.goals.sugar.unit})</h4>
        <InputNumber
          style={{ margin: "10px" }}
          defaultValue={DbSettings.goals.sugar.amount} // query from current settings
          // onChange={} // write to DB, TODO
        />
      </div>

      <br />
      <h2>Meal Information</h2>
      <h3>
        Edit the number, order, and names of your daily meals (that includes
        snacks!)
      </h3>
      {/* have some buttons for actions and a table with the number of meals based on DB settings */}
    </div>
  ) : (
    <div></div>
  );
}

export default Settings;
