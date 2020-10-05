import React, { useState, useEffect } from "react";
import { Select, InputNumber, Badge } from "antd";
import Reorder, {
  reorder,
  reorderImmutable,
  reorderFromTo,
  reorderFromToImmutable,
} from "react-reorder";
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
        <p>Set which page appears upon login :</p>
        <Select
          style={{ margin: "10px" }}
          defaultValue={DbSettings.view.defaultPage} // query from current settings
          onChange={(value) =>
            db
              .ref(settingsPathStr + "/view")
              .update({ defaultPage: value })
              .catch((error) => alert(error))
          } // write to db
        >
          <Option value={"meal planning"}>Meal Planning</Option>
          <Option value={"recipes"}>Recipes</Option>
          <Option value={"groceries"}>Groceries</Option>
        </Select>
      </div>
      <br />
      <div className="setting">
        <p>
          Within the meal planning page, set which layout appears by default :
        </p>
        <Select
          style={{ margin: "10px" }}
          defaultValue={DbSettings.view.defaultView} // query from current settings
          onChange={(value) =>
            db
              .ref(settingsPathStr + "/view")
              .update({ defaultView: value })
              .catch((error) => alert(error))
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
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.calories.amount} // query from current settings
            onChange={(value) =>
              db
                .ref(settingsPathStr + "/goals/calories")
                .update({ amount: value })
                .catch((error) => alert(error))
            } // write to DB
          />
        </div>

        <div className="goal">
          <p>Carbohydrates ({DbSettings.goals.carbohydrates.unit}) :</p>
          <InputNumber
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.carbohydrates.amount} // query from current settings
            onChange={(value) =>
              db
                .ref(settingsPathStr + "/goals/carbohydrates")
                .update({ amount: value })
                .catch((error) => alert(error))
            } // write to DB
          />
        </div>
        <div className="goal">
          <p>Protein ({DbSettings.goals.protein.unit}) :</p>
          <InputNumber
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.protein.amount} // query from current settings
            onChange={(value) =>
              db
                .ref(settingsPathStr + "/goals/protein")
                .update({ amount: value })
                .catch((error) => alert(error))
            } // write to DB
          />
        </div>
        <div className="goal">
          <p>Fat ({DbSettings.goals.fat.unit}) :</p>
          <InputNumber
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.fat.amount} // query from current settings
            onChange={(value) =>
              db
                .ref(settingsPathStr + "/goals/fat")
                .update({ amount: value })
                .catch((error) => alert(error))
            } // write to DB
          />
        </div>
        <div className="goal">
          <p>Sugar ({DbSettings.goals.sugar.unit}) :</p>
          <InputNumber
            style={{ margin: "10px" }}
            defaultValue={DbSettings.goals.sugar.amount} // query from current settings
            onChange={(value) =>
              db
                .ref(settingsPathStr + "/goals/sugar")
                .update({ amount: value })
                .catch((error) => alert(error))
            } // write to DB
          />
        </div>
      </div>
      <br />
      <h2>Meal Information</h2>
      <p>
        Edit the number, order, and names of your daily meals (that includes
        snacks!)
      </p>
      {/* have some buttons for actions and a table with the number of meals based on DB settings */}
      <Reorder
        reorderId="meal-list"
        itemKey="name"
        lock="horizontal"
        holdTime={100}
        className="meal-list"
        // TODO : add ability to pick color for meal, fix styling around badge and meal name
        // TODO : callBack // overwrite DB with names and keys of meals
      >
        {DbSettings.meals.map((meal) => (
          <div className="meal" key={meal.key}>
            <Badge color={meal.color} />
            <p>{meal.name}</p>
          </div>
        ))}
      </Reorder>
    </div>
  ) : (
    <div></div>
  );
}

export default Settings;
