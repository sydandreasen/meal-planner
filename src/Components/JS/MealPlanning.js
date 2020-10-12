import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  InputNumber,
  Button,
  Select,
  Modal,
  Descriptions,
  DatePicker,
} from "antd";
import "../SCSS/MealPlanning.scss";
import { Monthly } from "./Monthly.js";
import { Weekly } from "./Weekly.js";
import { Daily } from "./Daily.js";
import {
  CloseCircleOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import base from "./Firebase.js";
import { writeData } from "./DbHandler.js";
const db = base.database();

const { Option } = Select;

function MealPlanning(props) {
  const [view, setView] = useState(""); // monthly/weekly/daily
  // TODO put currentDate into localStorage too to maintain that on refresh as well
  const [currentDate, setCurrentDate] = useState(new Date()); // date selected
  const [showSearch, setShowSearch] = useState(false); // food search
  const [mealSettings, setMealSettings] = useState([]);
  const settingsPathStr = "users/" + props.uid + "/settings";
  const plansPathStr = "users/" + props.uid + "/plans";
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    db.ref(settingsPathStr + "/view").once("value", (snap) => {
      // listen to DB only once
      if (
        localStorage.getItem("view") &&
        localStorage.getItem("view").length > 0
      ) {
        setView(localStorage.getItem("view"));
      } else if (view === "") {
        setView(snap.val().defaultView);
      }
    });
  });

  useEffect(() => {
    db.ref(settingsPathStr).on("value", (snapshot) => {
      // listen to DB changes
      setMealSettings(snapshot.val().meals);
    });
  }, [props.uid, settingsPathStr]);

  useEffect(() => {
    db.ref(plansPathStr).on("value", (snapshot) => {
      // listen to DB changes
      setPlans(snapshot.val());
    });
  }, [props.uid, plansPathStr]);

  if (view && view.length > 0) {
    return (
      <div className="planning-page">
        <h1>Welcome to your Meal Planning Dashboard</h1>
        <div className="button-wrapper">
          <div className="left-group">
            <Button type="primary" onClick={() => setShowSearch(!showSearch)}>
              Add Food
            </Button>
            <Button type="primary">Export Plan</Button>
          </div>
          <div className="right-group">
            <Button type="primary" onClick={() => setCurrentDate(new Date())}>
              Jump to Today
            </Button>
            <Select
              defaultValue={view}
              style={{ width: 140 }}
              onChange={(value) => {
                setView(value);
                localStorage.setItem("view", value); // store to load same weekly/monthly/daily view on refesh if the meal planning page was the one up
              }}
            >
              <Option value={"monthly"}>Monthly View</Option>
              <Option value={"weekly"}>Weekly View</Option>
              <Option value={"daily"}>Daily View</Option>
            </Select>
          </div>
        </div>
        <Search
          visible={showSearch}
          setShowSearch={(bool) => setShowSearch(bool)}
          mealSettings={mealSettings}
          plansPathStr={plansPathStr}
          plans={plans}
        />
        <div className="calendar">
          {view === "monthly" ? (
            <Monthly
              currentDate={currentDate}
              setCurrentDate={(date) => setCurrentDate(date)}
              mealSettings={mealSettings}
              plans={plans}
            />
          ) : view === "weekly" ? (
            <Weekly
              currentDate={currentDate}
              setCurrentDate={(date) => setCurrentDate(date)}
              mealSettings={mealSettings}
              plans={plans}
            />
          ) : view === "daily" ? (
            <Daily
              currentDate={currentDate}
              setCurrentDate={(date) => setCurrentDate(date)}
              mealSettings={mealSettings}
              plans={plans}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export const Search = (props) => {
  const [searchStr, setSearchStr] = useState("");
  const [showFoodInfo, setShowFoodInfo] = useState(false);
  const [foodInfo, setFoodInfo] = useState([]);
  const [foodName, setFoodName] = useState("");
  const getFood = async (searchStr) => {
    if (searchStr) {
      // get the URL encorded for the parser request
      const foodStr = searchStr.replace(" ", "%20");
      const parserReq = `https://api.edamam.com/api/food-database/v2/parser?ingr=${foodStr}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`;

      // get info from parser request to give to nutrients request
      let servURI = "";
      let quantity = 1;
      let foodId = "";

      // parser request
      await axios
        .get(parserReq)
        .then((response) => {
          foodId = response.data.hints[0].food.foodId;
          setFoodName({ word: response.data.text, id: foodId });
          // find which measure is for serving
          response.data.hints[0].measures.forEach((measure) => {
            if (measure.label === "Serving") {
              servURI = measure.uri;
            }
          });
        })
        .catch(() => console.error("Parser GET request failed."));

      // nutrients request
      await axios
        .post(
          `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`,
          {
            ingredients: [
              {
                quantity: quantity,
                measureURI: servURI,
                foodId: foodId,
              },
            ],
          }
        )
        .then((response) => {
          let tempInfo = [];
          tempInfo[0] = {
            label: "Calories",
            quantity: response.data.calories,
            unit: "cals",
          };
          let nutrientNames = Object.getOwnPropertyNames(
            response.data.totalNutrients
          );
          nutrientNames.forEach((nutrient) => {
            tempInfo.push({
              label: response.data.totalNutrients[nutrient].label,
              quantity: response.data.totalNutrients[nutrient].quantity,
              unit: response.data.totalNutrients[nutrient].unit,
            });
          });
          setFoodInfo(tempInfo);
          setShowFoodInfo(true);
        })
        .catch(() => console.error("Nutrients POST request failed."));
    }
  };

  return (
    <Modal
      className="search"
      footer={<div></div>}
      visible={props.visible}
      onCancel={() => props.setShowSearch(false)}
      centered={true}
      closeIcon={<CloseCircleOutlined />}
      title="Food Search"
    >
      <Input
        placeholder="Search for a Food"
        onChange={(e) => setSearchStr(e.target.value)}
        onPressEnter={() => getFood(searchStr)}
      />
      <Button type="primary" onClick={() => getFood(searchStr)}>
        Search
      </Button>

      {showFoodInfo ? (
        <FoodInfo
          plansPathStr={props.plansPathStr}
          plans={props.plans}
          food={foodName} // word and id
          nutrients={foodInfo}
          mealSettings={props.mealSettings}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};

export const FoodInfo = (props) => {
  const [showNutrients, setShowNutrients] = useState(true);
  const [addFood, setAddFood] = useState({});

  return (
    <div className="food-wrapper">
      <div className="head">
        <h3>{`${props.food.word} (1 Serving)`}</h3>
        <Button
          type="primary"
          icon={
            showNutrients ? <PlusCircleOutlined /> : <MinusCircleOutlined />
          }
          onClick={() => setShowNutrients(!showNutrients)}
        >
          Add to Plan
        </Button>
      </div>
      {showNutrients ? (
        <Descriptions
          bordered
          column={1}
          size={"small"}
          className={"food-info"}
        >
          {props.nutrients.map((nutrient, index) => (
            <Descriptions.Item
              key={index}
              label={`${nutrient.label} (${nutrient.unit})`}
            >
              {nutrient.quantity.toFixed(2)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <div className="add-food">
          <DatePicker
            placeholder="Select a date to plan this food"
            onChange={(date, dateString) => {
              setAddFood((prevState) => {
                return { ...prevState, date: dateString };
              });
            }}
          />
          <Select
            placeholder="Select a meal to plan this food"
            onChange={(selection) => {
              setAddFood((prevState) => {
                return { ...prevState, meal: selection };
              });
            }}
          >
            {props.mealSettings.map((meal) => (
              <Option value={meal.name} key={meal.key}>
                {meal.name}
              </Option>
            ))}
          </Select>
          <br />
          <div className="quantity">
            <p>Quantity :</p>
            <InputNumber
              style={{ margin: "10px", display: "block" }}
              defaultValue={1}
              onChange={(num) =>
                setAddFood((prevState) => {
                  return { ...prevState, quantity: num };
                })
              }
            />
          </div>

          <br />
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              let add = addFood;
              add = {
                ...add,
                foodId: props.food.id,
                name: props.food.word,
              };
              if (!add.quantity) {
                // wasn't defined, left as default value of one
                add.quantity = 1;
              }
              let mealFoods =
                props.plans &&
                props.plans[add.date] &&
                props.plans[add.date][add.meal]
                  ? props.plans[add.date][add.meal] // if there's info for data and meal, use it
                  : [];
              // determine if food already saved to meal or not.
              // if it is, add the quantities together
              // if not, push to mealFoods
              let alreadyPlanned = false;
              mealFoods.forEach((food, index) => {
                if (food.foodId === add.foodId) {
                  mealFoods[index].quantity =
                    mealFoods[index].quantity + add.quantity;
                  alreadyPlanned = true;
                }
              });
              if (!alreadyPlanned) {
                mealFoods.push({
                  foodId: add.foodId,
                  quantity: add.quantity,
                  name: add.name,
                });
              }
              writeData(
                props.plansPathStr + "/" + add.date + "/" + add.meal,
                mealFoods
              );
            }}
          >
            Add it!
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealPlanning;
