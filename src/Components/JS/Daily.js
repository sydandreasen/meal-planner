import React, { useState } from "react";
import {
  LeftOutlined,
  RightOutlined,
  ExpandAltOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Tooltip, Badge, Table, InputNumber, Popconfirm } from "antd";
import { dayNutrients, mealNutrients, nutrientRequest } from "./Commons.js";
import "../SCSS/Daily.scss";
import "../../../node_modules/react-vis/dist/style.css";
import ProgressGraph from "./ProgressGraph.js";

export const DailyMeal = (props) => {
  const [edit, setEdit] = useState(false);

  const columns = [
    { title: "Food", dataIndex: "food", key: "food" },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (cell, row) =>
        edit ? (
          <div>
            <InputNumber defaultValue={cell} size="middle" />
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
      title: "Expand", // TODO add action to expand and see multiple nutition informations for food item, similar to results of food search
      key: "expand",
      render: (cell, row) => (
        <ExpandAltOutlined style={{ color: "rgb(24, 144, 255)" }} />
      ),
    },
    {
      title: "Remove", // TODO add ability to remove foods
      key: "remove",
      render: (cell, row) => (
        <Popconfirm
          title={`Remove ${row.food}?`}
          icon={<DeleteOutlined style={{ color: "rgb(248, 31, 7)" }} />}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "rgb(248, 31, 7)" }} />
        </Popconfirm>
      ),
    },
  ];

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
        calories: cals, // TODO use API call results for individual food calories
        actions: "",
      });
    });
  }

  let mealCals = 0;
  if (props.plans) {
    console.log(props.plans[props.mealName]); // FIXME : why is this returning undefined??
  }
  if (props.plans && props.plans[props.mealName]) {
    props.plans[props.mealName].forEach((food) => {
      console.log(food);
      food.info.forEach((info) => {
        console.log(info);
        if (info.label === "Calories") {
          mealCals = info.quantity;
        }
      });
    });
  }

  return (
    <tr className="meal">
      <td>
        <Badge
          color={props.color}
          text={`${props.mealName} : ${mealCals} cals`}
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

export const DailyCard = (props) => {
  return (
    <div className="daily-card">
      <div className="day-num">
        <p>{props.date.getDate()}</p>{" "}
      </div>
      <div
        className="total-cals"
        // TODO need to get data queried in order to total up the day's calories
      >
        {dayNutrients.cals ? dayNutrients.cals : 0} cals
      </div>
      <table className="meals">
        <tbody>
          {props.mealSettings.map((meal) => (
            <DailyMeal
              color={meal.color}
              mealName={meal.name}
              key={meal.key}
              plans={
                props.plans // if the plans already have the date, try to return the meal-specific plans, otherwise return undefined, as plans without the date returns undefined anyway
                  ? props.plans[
                      meal.name.charAt(0).toUpperCase() + meal.name.slice(1)
                    ]
                  : undefined
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Daily = (props) => {
  const [dayNutrients, setDayNutrients] = useState({});
  console.log(dayNutrients);
  const currentDate = props.currentDate;
  const dayPlan =
    props.plans[
      `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1 > 9
          ? currentDate.getMonth() + 1
          : `0${currentDate.getMonth() + 1}`
      }-${
        currentDate.getDate() > 9
          ? currentDate.getDate()
          : `0${currentDate.getDate()}`
      }`
    ];
  // if day plans from DB found but the nutrients for those foods haven't been found:
  if (dayPlan && Object.getOwnPropertyNames(dayNutrients).length === 0) {
    // find nutrients for all foods in each meal that's planned
    let mealNames = Object.getOwnPropertyNames(dayPlan);
    mealNames.forEach((name, mealIndex) => {
      let mealPlan = dayPlan[name];
      mealPlan.forEach((food, foodIndex) => {
        let servingURI =
          "http://www.edamam.com/ontologies/edamam.owl#Measure_serving";
        nutrientRequest(
          [food.foodId],
          [servingURI],
          (foodInfo) => {
            setDayNutrients((prevState) => {
              let newNutr = { ...prevState };
              if (!newNutr[name]) {
                newNutr[name] = [];
              }
              newNutr[name].push({
                food: food.name,
                quantity: food.quantity,
                info: foodInfo,
              });
              return newNutr;
            });
          }
          // TODO : edit this function here to keep track of this nutrition information as a part of the meal's plan as a part of the whole day's plan
          // Eventually also make sure quantity is correct based on how many servings planned
        );
      });
    });
  }
  // TODO use the API call results for day's total nutrients in DailyCard and in ProgressGraphs
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
          plans={
            dayNutrients
            // props.plans[
            //   `${currentDate.getFullYear()}-${
            //     currentDate.getMonth() + 1 > 9
            //       ? currentDate.getMonth() + 1
            //       : `0${currentDate.getMonth() + 1}`
            //   }-${
            //     currentDate.getDate() > 9
            //       ? currentDate.getDate()
            //       : `0${currentDate.getDate()}`
            //   }`
            // ]
          }
        />
        <div className="progress">
          <h3>Planned Nutrition vs. Goal Nutrition</h3>
          <div className="progress-graphs">
            {Object.getOwnPropertyNames(props.goals).map((goal, index) => (
              <ProgressGraph
                key={index}
                goal={props.goals[goal]}
                measure={goal}
                total={100} // FIXME make charts use information from daily planned nutrition
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
