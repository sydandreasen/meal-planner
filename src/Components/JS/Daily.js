import React, { useEffect, useState } from "react";
import {
  LeftOutlined,
  RightOutlined,
  ExpandAltOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Tooltip,
  Badge,
  Table,
  InputNumber,
  Popconfirm,
  Modal,
  Descriptions,
} from "antd";
import { nutrientRequest } from "./Commons.js";
import "../SCSS/Daily.scss";
import { writeData } from "./DbHandler.js";
import ProgressGraph from "./ProgressGraph.js";

// individual meals in daily view containing meal name, cals, and table of foods
export const DailyMeal = (props) => {
  const [edit, setEdit] = useState(false);
  const [expandKey, setExpandKey] = useState("");
  const columns = [
    { title: "Food", dataIndex: "food", key: "food" },
    {
      title: "Quantity (Servings)",
      dataIndex: "quantity",
      key: "quantity",
      render: (cell, row) =>
        edit ? (
          <div>
            <InputNumber
              defaultValue={cell}
              min={1}
              size="middle"
              onChange={(value) => {
                // find array in plans, change the food with the food id and write data to props.mealPathStr
                let newPlans = [];
                props.plans.forEach((food) => {
                  if (food.id !== row.id) {
                    newPlans.push({
                      foodId: food.id,
                      name: food.food,
                      quantity: food.quantity,
                    });
                  } else {
                    newPlans.push({
                      foodId: food.id,
                      name: food.food,
                      quantity: value,
                    });
                  }
                });
                writeData(props.mealPathStr, newPlans);
                let newDayNutrients = { ...props.dayNutrients };
                let editIdx = -1;
                newDayNutrients[props.mealName].forEach((food, index) => {
                  if (food.id === row.id) {
                    editIdx = index;
                  }
                });
                // edit quantity and corresponding nutrient quantities in props.dayNutrients
                newDayNutrients[props.mealName][editIdx].info.forEach(
                  (info) =>
                    (info.quantity *=
                      value / newDayNutrients[props.mealName][editIdx].quantity)
                );
                newDayNutrients[props.mealName][editIdx].quantity = value;
              }}
            />
            <CheckSquareOutlined
              style={{ color: "rgb(59, 162, 81)" }}
              onClick={() => setEdit(false)}
            />
          </div>
        ) : (
          <Tooltip title="Click to Edit Quantity" color={"black"}>
            <span onClick={() => setEdit(true)}>{cell}</span>
          </Tooltip>
        ),
    },
    { title: "Calories", dataIndex: "calories", key: "calories" },
    {
      title: "Expand",
      key: "expand",
      render: (cell, row) =>
        expandKey === row.id ? (
          <Modal
            footer={<div></div>}
            className="food-expanded"
            visible={expandKey === row.id}
            onCancel={() => setExpandKey("")}
            centered={true}
            closeIcon={<CloseCircleOutlined />}
            title={`Planned Nutrition Info for ${row.food} (${row.quantity} ${
              row.quantity > 1 ? `Servings` : `Serving`
            })`}
          >
            <Descriptions
              bordered
              column={1}
              size={"small"}
              className={"food-info"}
            >
              {props.dayNutrients[props.mealName][row.key].info.map(
                (nutrient, index) => (
                  <Descriptions.Item
                    key={index}
                    label={`${nutrient.label} (${nutrient.unit})`}
                  >
                    {nutrient.quantity.toFixed(2)}
                  </Descriptions.Item>
                )
              )}
            </Descriptions>
          </Modal>
        ) : (
          <ExpandAltOutlined
            style={{ color: "rgb(24, 144, 255)" }}
            onClick={() => setExpandKey(row.id)}
          />
        ),
    },
    {
      title: "Remove",
      key: "remove",
      render: (cell, row) => (
        <Popconfirm
          title={`Remove ${row.food}?`}
          icon={<DeleteOutlined style={{ color: "rgb(248, 31, 7)" }} />}
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            // find array in plans, remove the food with the food id and write data to props.mealPathStr
            let newPlans = [];
            props.plans.forEach((food) => {
              if (food.id !== row.id) {
                newPlans.push({
                  foodId: food.id,
                  name: food.food,
                  quantity: food.quantity,
                });
              }
            });
            writeData(props.mealPathStr, newPlans);
            let newDayNutrients = { ...props.dayNutrients };
            let removeIdx = -1;
            newDayNutrients[props.mealName].forEach((food, index) => {
              if (food.id === row.id) {
                removeIdx = index;
              }
            });
            newDayNutrients[props.mealName].splice(removeIdx);
          }}
        >
          <DeleteOutlined style={{ color: "rgb(248, 31, 7)" }} />
        </Popconfirm>
      ),
    },
  ];

  // collect list of foods for Table datasource format
  let foods = [];
  if (props.plans) {
    props.plans.forEach((food, index) => {
      // find calories for the food
      let cals = undefined;
      food.info.forEach((info) => {
        if (info.label === "Calories") {
          cals = info.quantity;
        }
      });
      foods.push({
        key: index,
        food: food.food,
        quantity: food.quantity,
        calories: cals,
        actions: "",
        id: food.id,
      });
    });
  }

  return (
    <tr className="meal">
      <td>
        <Badge
          color={props.color}
          text={`${props.mealName} : ${
            props.mealCals ? props.mealCals : 0
          } cals`}
        />

        <Table
          size={"small"}
          pagination={false}
          columns={columns}
          dataSource={foods}
        />
      </td>
    </tr>
  );
};

// the card containing all daily meals and day's calories
export const DailyCard = (props) => {
  const [mealCals, setMealCals] = useState({});
  const [dayCals, setDayCals] = useState(0);
  // find the total calories for each meal
  useEffect(() => {
    let tempMealCals = {};
    Object.getOwnPropertyNames(props.plans).forEach((mealName) => {
      let meal = props.plans[mealName];
      if (mealName !== "date") {
        meal.forEach((food) => {
          food.info.forEach((info) => {
            if (info.label === "Calories") {
              if (!tempMealCals[mealName]) {
                tempMealCals[mealName] = info.quantity;
              } else {
                tempMealCals[mealName] += info.quantity;
              }
            }
          });
        });
      }
    });
    setMealCals(tempMealCals);
  }, [props.plans]);

  // find the total calories for the whole day
  useEffect(() => {
    let tempSum = 0;
    Object.getOwnPropertyNames(mealCals).forEach((mealName) => {
      tempSum += mealCals[mealName];
    });
    setDayCals(tempSum);
  }, [mealCals]);
  return (
    <div className="daily-card">
      <div className="day-num">
        <p>{props.date.getDate()}</p>{" "}
      </div>
      <div className="total-cals">
        {`${dayCals} `}
        cals
      </div>
      <table className="meals">
        <tbody>
          {props.mealSettings.map((meal) => (
            <DailyMeal
              color={meal.color}
              mealName={meal.name}
              key={meal.key}
              mealCals={mealCals[meal.name]}
              mealPathStr={props.dayPathStr + meal.name}
              plans={
                props.plans // if the plans already have the date, try to return the meal-specific plans, otherwise return undefined, as plans without the date returns undefined anyway
                  ? props.plans[
                      meal.name.charAt(0).toUpperCase() + meal.name.slice(1)
                    ]
                  : undefined
              }
              dayNutrients={props.dayNutrients}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// daily view containing daily card and progress graphs for nutrients
export const Daily = (props) => {
  const [dayNutrients, setDayNutrients] = useState({});
  const [dayTotals, setDayTotals] = useState({});
  const currentDate = props.currentDate;
  let dayPathStr =
    props.plansPathStr +
    "/" +
    `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1 > 9
        ? currentDate.getMonth() + 1
        : `0${currentDate.getMonth() + 1}`
    }-${
      currentDate.getDate() > 9
        ? currentDate.getDate()
        : `0${currentDate.getDate()}`
    }` +
    "/";
  const dayPlan = props.plans
    ? props.plans[
        `${currentDate.getFullYear()}-${
          currentDate.getMonth() + 1 > 9
            ? currentDate.getMonth() + 1
            : `0${currentDate.getMonth() + 1}`
        }-${
          currentDate.getDate() > 9
            ? currentDate.getDate()
            : `0${currentDate.getDate()}`
        }`
      ]
    : {};

  // find day totals for all nutrition categories that have goals
  useEffect(() => {
    let goals = Object.getOwnPropertyNames(props.goals);
    goals.forEach((goal) => {
      // ensure won't be case-sensitive below
      goal = goal.toLowerCase();
    });
    let tempDayTotals = {};
    Object.getOwnPropertyNames(dayNutrients).forEach((mealName) => {
      let meal = dayNutrients[mealName];
      if (mealName !== "date") {
        meal.forEach((food) => {
          food.info.forEach((info) => {
            // note that sugar is sugars in API info and carbohydrates is carbs in API info
            let label = info.label.toLowerCase();
            if (label === "carbs") {
              label = "carbohydrates";
            } else if (label === "sugars") {
              label = "sugar";
            }
            // find matches between goals and info
            let idx = goals.indexOf(label);
            if (idx !== -1) {
              let match = goals[idx];
              if (!tempDayTotals[match]) {
                tempDayTotals[match] = info.quantity;
              } else {
                tempDayTotals[match] += info.quantity;
              }
            }
          });
        });
      }
    });
    setDayTotals(tempDayTotals);
  }, [dayNutrients, props.goals]);

  // when finding a new currentDate, call for and keep track of nutrition info
  useEffect(() => {
    if (dayPlan) {
      // find nutrients for all foods in each meal that's planned
      let mealNames = Object.getOwnPropertyNames(dayPlan);
      mealNames.forEach((name, mealIndex) => {
        let mealPlan = dayPlan[name];
        mealPlan.forEach((food, foodIndex) => {
          let servingURI =
            "http://www.edamam.com/ontologies/edamam.owl#Measure_serving";
          nutrientRequest([food.foodId], [servingURI], (foodInfo) => {
            setDayNutrients((prevState) => {
              let newNutr = { ...prevState }; // for building onto list of other foods (same day)
              if (newNutr.date !== currentDate) {
                // needing to reset then grab food (switched day)
                newNutr = {};
              }
              if (!newNutr[name]) {
                newNutr[name] = [];
              }
              newNutr.date = currentDate; // to keep track of whether or not dayNutrients should build or first reset
              // check if food id is already included in the nutrient plan
              // if so, just check quantity, otherwise, push a new food
              let foodIds = [];
              newNutr[name].forEach((food) => foodIds.push(food.id));
              if (foodIds.indexOf(food.foodId) === -1) {
                // this food is not already within the plan
                // if quantity > 1, must recompute foodInfo before pushing
                let foodNutrients = foodInfo;
                if (food.quantity > 1) {
                  foodNutrients.forEach((nutrient) => {
                    nutrient.quantity *= food.quantity;
                  });
                }
                newNutr[name].push({
                  food: food.name,
                  quantity: food.quantity,
                  info: foodNutrients,
                  id: food.foodId,
                });
              } else if (
                newNutr[name][foodIds.indexOf(food.foodId)].quantity !==
                food.quantity
              ) {
                // this food is already within the plan, adjust if quantity is being changed, otherwise leave alone (correct in newNutr)
                let idx = foodIds.indexOf(food.foodId);
                newNutr[name][idx].quantity = food.quantity;
                newNutr[name][idx].info.forEach(
                  (nutrient) => (nutrient.quantity *= food.quantity)
                );
              }
              return newNutr;
            });
          });
        });
      });
    } else {
      // dayPlan is undefined, no plans for day --> make no nutrients for day
      setDayNutrients({});
    }
  }, [currentDate, dayPlan]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <div className="daily">
      <div className="header">
        <Tooltip title="Previous Day" color={"black"}>
          <LeftOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate() - 1
                )
              );
            }}
          />
        </Tooltip>
        <h2>{`${weekdayNames[currentDate.getDay()]}, ${
          months[currentDate.getMonth()]
        } ${currentDate.getDate()}, ${currentDate.getFullYear()}`}</h2>
        <Tooltip title="Next Day" color={"black"}>
          <RightOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate() + 1
                )
              );
            }}
          />
        </Tooltip>
      </div>
      <div className="content">
        <DailyCard
          date={currentDate}
          mealSettings={props.mealSettings}
          plans={dayNutrients}
          dayPathStr={dayPathStr}
          dayNutrients={dayNutrients}
        />
        <div className="progress">
          <h3>Planned Nutrition vs. Goal Nutrition</h3>
          <div className="progress-graphs">
            {Object.getOwnPropertyNames(props.goals).map((goal, index) => (
              <ProgressGraph
                key={index}
                goal={props.goals[goal]}
                measure={goal}
                total={dayTotals}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
