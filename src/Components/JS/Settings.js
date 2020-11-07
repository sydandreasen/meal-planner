import React, { useState, useEffect } from "react";
import { Select, InputNumber } from "antd";
import base from "./Firebase.js";
import MealSettings from "./MealSettings.js";
import { updateData } from "./DbHandler.js";
import "../SCSS/Settings.scss";
const db = base.database();
const { Option } = Select;

// allow the user to customize various features of the app for themselves
function Settings(props) {
  const settingsPathStr = "users/" + props.uid + "/settings";
  const [DbSettings, setDbSettings] = useState({});

  useEffect(() => {
    db.ref(settingsPathStr).on("value", (snapshot) => {
      // listen to DB changes
      setDbSettings(snapshot.val());
    });
  }, [props.uid, settingsPathStr]);

  return DbSettings &&
    DbSettings.view &&
    DbSettings.goals &&
    DbSettings.meals ? (
    <div className="settings">
      <h1>Customize your Account Settings</h1>
      <h2>Views</h2>
      {/* <div className="setting">
        <p>Set which page appears upon login :</p>
        <Select
          style={{ margin: "10px" }}
          defaultValue={DbSettings.view.defaultPage} // query from current settings
          onChange={(value) =>
            updateData(settingsPathStr + "/view", { defaultPage: value })
          } // write to db
        >
          <Option value={"meal planning"}>Meal Planning</Option>
          <Option value={"recipes"}>Recipes</Option>
          <Option value={"groceries"}>Groceries</Option>
        </Select>
      </div>
      <br /> */}
      <div className="setting">
        <p>
          Within the meal planning page, set which layout appears by default :
        </p>
        <Select
          style={{ margin: "10px" }}
          defaultValue={DbSettings.view.defaultView} // query from current settings
          onChange={(value) =>
            updateData(settingsPathStr + "/view", { defaultView: value })
          } // write to db
        >
          <Option value={"monthly"}>Monthly View</Option>
          <Option value={"weekly"}>Weekly View</Option>
          <Option value={"daily"}>Daily View</Option>
        </Select>
      </div>

      <br />
      <h2>Daily Nutritional Goals</h2>

      <p>
        Set up your goals for daily nutrition to make planning healthy meals a
        breeze :
      </p>
      <div className="setting">
        <div className="goal">
          <p>Calories :</p>
          <InputNumber
            min={0}
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.calories.amount} // query from current settings
            onChange={(value) =>
              updateData(settingsPathStr + "/goals/calories", { amount: value })
            } // write to DB
          />
        </div>

        <div className="goal">
          <p>Carbohydrates ({DbSettings.goals.carbohydrates.unit}) :</p>
          <InputNumber
            min={0}
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.carbohydrates.amount} // query from current settings
            onChange={(value) =>
              updateData(settingsPathStr + "/goals/carbohydrates", {
                amount: value,
              })
            } // write to DB
          />
        </div>
        <div className="goal">
          <p>Protein ({DbSettings.goals.protein.unit}) :</p>
          <InputNumber
            min={0}
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.protein.amount} // query from current settings
            onChange={(value) =>
              updateData(settingsPathStr + "/goals/protein", { amount: value })
            } // write to DB
          />
        </div>
        <div className="goal">
          <p>Fat ({DbSettings.goals.fat.unit}) :</p>
          <InputNumber
            min={0}
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.fat.amount} // query from current settings
            onChange={(value) =>
              updateData(settingsPathStr + "/goals/fat", { amount: value })
            } // write to DB
          />
        </div>
        <div className="goal">
          <p>Sugar ({DbSettings.goals.sugar.unit}) :</p>
          <InputNumber
            min={0}
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.sugar.amount} // query from current settings
            onChange={(value) =>
              updateData(settingsPathStr + "/goals/sugar", { amount: value })
            } // write to DB
          />
        </div>
      </div>
      <br />
      <MealSettings db={db} settingsPathStr={settingsPathStr} />
    </div>
  ) : (
    <div></div>
  );
}

export default Settings;
