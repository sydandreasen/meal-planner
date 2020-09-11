import React from "react";
import { Button } from "antd";
import "../SCSS/MealPlanning.scss";
import { Monthly } from "./Monthly.js";

function MealPlanning(props) {
  return (
    <div className="planning-page">
      <h1>Welcome to your Meal Planning Dashboard</h1>
      <div className="button-wrapper">
        <div className="left-group">
          <Button type="primary">Edit Meals</Button>
          <Button type="primary">Export Plan</Button>
        </div>
        <div className="right-group">
          <Button type="primary">Monthly View</Button>
          <Button type="primary">Weekly View</Button>
          <Button type="primary">Daily View</Button>
        </div>
      </div>
      <div className="calendar">
        <Monthly />
      </div>
    </div>
  );
}

export default MealPlanning;
