import React, { useState } from "react";
import {
  LeftOutlined,
  RightOutlined,
  ExpandAltOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Tooltip, Badge, Table, InputNumber, Popconfirm } from "antd";
import { dayNutrients, mealNutrients, foodNutrients } from "./Commons.js";
import "../SCSS/Daily.scss";

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
      title: "Expand",
      key: "expand",
      render: (cell, row) => (
        <ExpandAltOutlined style={{ color: "rgb(24, 144, 255)" }} />
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
        >
          <DeleteOutlined style={{ color: "rgb(248, 31, 7)" }} />
        </Popconfirm>
      ),
    },
  ];

  let foods = [];
  if (props.plans) {
    props.plans.forEach((food, index) => {
      foods.push({
        key: index,
        food: food.name,
        quantity: food.quantity,
        calories: "XX",
        actions: "",
      });
    });
  }
  // else {
  //   foods = [
  //     {
  //       key: "1",
  //       food: "Food 1",
  //       quantity: foodNutrients.quantity ? foodNutrients.quantity : 0,
  //       calories: foodNutrients.cals ? foodNutrients.cals : 0,
  //       actions: "",
  //     },
  //     {
  //       key: "2",
  //       food: "Food 2",
  //       quantity: foodNutrients.quantity ? foodNutrients.quantity : 0,
  //       calories: foodNutrients.cals ? foodNutrients.cals : 0,
  //       actions: "",
  //     },
  //     {
  //       key: "3",
  //       food: "Food 3",
  //       quantity: foodNutrients.quantity ? foodNutrients.quantity : 0,
  //       calories: foodNutrients.cals ? foodNutrients.cals : 0,
  //       actions: "",
  //     },
  //     {
  //       key: "4",
  //       food: "Food 4",
  //       quantity: foodNutrients.quantity ? foodNutrients.quantity : 0,
  //       calories: foodNutrients.cals ? foodNutrients.cals : 0,
  //       actions: "",
  //     },
  //   ];
  // }

  return (
    <tr className="meal">
      <td>
        <Badge
          color={props.color}
          text={`${props.mealName} : ${
            mealNutrients.cals ? mealNutrients.cals : 0
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
  const currentDate = props.currentDate;
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
      <DailyCard
        date={currentDate}
        mealSettings={props.mealSettings}
        plans={
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
          ]
        }
      />
    </div>
  );
};
