import React, { useState } from "react";
import { Button, Select } from "antd";
import "../SCSS/MealPlanning.scss";
import { Monthly } from "./Monthly.js";
import { Weekly } from "./Weekly.js";
import { Daily } from "./Daily.js";

const { Option } = Select;

function MealPlanning(props) {
  const [view, setView] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <div className="planning-page">
      <h1>Welcome to your Meal Planning Dashboard</h1>
      <div className="button-wrapper">
        <div className="left-group">
          <Button type="primary">Add Food</Button>
          <Button type="primary">Export Plan</Button>
        </div>
        <div className="right-group">
          <Button type="primary" onClick={() => setCurrentDate(new Date())}>
            Jump to Today
          </Button>
          <Select
            defaultValue={"weekly"}
            style={{ width: 140 }}
            onChange={(value) => setView(value)}
          >
            <Option value={"monthly"}>Monthly View</Option>
            <Option value={"weekly"}>Weekly View</Option>
            <Option value={"daily"}>Daily View</Option>
          </Select>
        </div>
      </div>
      <div className="calendar">
        {view === "monthly" ? (
          <Monthly
            currentDate={currentDate}
            setCurrentDate={(date) => setCurrentDate(date)}
          />
        ) : view === "weekly" ? (
          <Weekly
            currentDate={currentDate}
            setCurrentDate={(date) => setCurrentDate(date)}
          />
        ) : view === "daily" ? (
          <Daily
            currentDate={currentDate}
            setCurrentDate={(date) => setCurrentDate(date)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default MealPlanning;
