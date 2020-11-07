import React, { useState, useEffect } from "react";
import {
  Input,
  InputNumber,
  Button,
  Select,
  Modal,
  Descriptions,
  DatePicker,
  Spin,
} from "antd";
import { parseRequest } from "./Commons.js";
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
import moment from "moment";
const db = base.database();

const { Option } = Select;

// the meal planning page
// a wrapper containing consistent actions and will contain the current monthly/weekly/daily view
function MealPlanning(props) {
  const [view, setView] = useState(""); // monthly/weekly/daily
  const [currentDate, setCurrentDate] = useState(new Date()); // date selected
  const [showSearch, setShowSearch] = useState(false); // food search
  const [mealSettings, setMealSettings] = useState([]);
  const settingsPathStr = "users/" + props.uid + "/settings";
  const plansPathStr = "users/" + props.uid + "/plans";
  const [plans, setPlans] = useState([{}]);
  const [goals, setGoals] = useState([]);

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

  useEffect(() => {
    db.ref(settingsPathStr + "/goals").on("value", (snapshot) => {
      // listen to DB changes
      setGoals(snapshot.val());
    });
  }, [props.uid, settingsPathStr]);

  if (view && view.length > 0 && goals && goals.calories) {
    return (
      <div className="planning-page">
        <h1>Welcome to your Meal Planning Dashboard</h1>
        <div className="button-wrapper">
          <div className="left-group">
            <Button type="primary" onClick={() => setShowSearch(!showSearch)}>
              Add Food
            </Button>
            {/* <Button type="primary">Export Plan</Button> */}
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
          currentDate={currentDate}
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
              goals={goals}
              plansPathStr={plansPathStr}
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

// the modal for searching for foods, calling to API
export const Search = (props) => {
  const [searchStr, setSearchStr] = useState("");
  const [showFoodInfo, setShowFoodInfo] = useState(false);
  const [foodInfo, setFoodInfo] = useState([]);
  const [foodId, setFoodId] = useState("");
  const [foodWord, setFoodWord] = useState("");
  const getFood = (searchStr) => {
    if (searchStr) {
      parseRequest(
        searchStr,
        (foodId) => setFoodId(foodId),
        (measureURI) => measureURI,
        (foodWord) => setFoodWord(foodWord),
        (foodInfo) => setFoodInfo(foodInfo)
      );
      setShowFoodInfo(true);
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
          food={{ word: foodWord, id: foodId }} // word and id
          nutrients={foodInfo}
          mealSettings={props.mealSettings}
          currentDate={props.currentDate}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};

// displaying retrieved food information
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
        props.nutrients.length === 0 ? (
          <Spin size="large" />
        ) : (
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
        )
      ) : (
        <div className="add-food">
          <DatePicker
            placeholder="Select a date to plan this food"
            defaultValue={moment(props.currentDate)}
            onChange={(date, dateString) => {
              setAddFood((prevState) => {
                return { ...prevState, date: dateString };
              });
            }}
          />
          <Select
            placeholder="Select a meal to plan this food"
            defaultValue={props.mealSettings[0].name}
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
              min={1}
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
              if (!add.date) {
                // wasn't defined, left as default value of current date
                let str = `${props.currentDate.getFullYear()}-${
                  props.currentDate.getMonth() + 1 > 9
                    ? props.currentDate.getMonth() + 1
                    : `0${props.currentDate.getMonth() + 1}`
                }-${
                  props.currentDate.getDate() > 9
                    ? props.currentDate.getDate()
                    : `0${props.currentDate.getDate()}`
                }`;
                add.date = str;
              }
              if (!add.meal) {
                // wasn't defined, left as default value of first meal
                add.meal = props.mealSettings[0].name;
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
