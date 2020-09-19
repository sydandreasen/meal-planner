import React, { useState } from "react";
import {
  LeftOutlined,
  RightOutlined,
  ExpandAltOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Tooltip,
  Badge,
  Table,
  // Modal,
  InputNumber,
  Popconfirm,
} from "antd";
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

  const foods = [
    { key: "1", food: "Food 1", quantity: "4", calories: 100, actions: "" },
    { key: "2", food: "Food 2", quantity: "3", calories: 300, actions: "" },
    { key: "3", food: "Food 3", quantity: "2", calories: 550, actions: "" },
    { key: "4", food: "Food 4", quantity: "1", calories: 284, actions: "" },
  ];

  return (
    <tr className="meal">
      <Badge color={props.color} text={`${props.mealName} : 1234 cals`} />

      <Table
        size={"small"}
        pagination={false}
        columns={columns}
        dataSource={foods}
      />
    </tr>
  );
};

export const DailyCard = (props) => {
  return (
    <div className="daily-card">
      <div className="day-num">
        <p>{props.date.getDate()}</p>{" "}
      </div>
      <div className="total-cals">3702 cals</div>
      <table className="meals">
        <tbody>
          <DailyMeal color={"red"} mealName={"Breakfast"} />
          <DailyMeal color={"blue"} mealName={"Lunch"} />
          <DailyMeal color={"green"} mealName={"Dinner"} />
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
      <DailyCard date={currentDate} />
    </div>
  );
};
