import React, { useState } from "react";
import { Button } from "antd";
import "../SCSS/MealPlanning.scss";
import { Monthly } from "./Monthly.js";
import { Weekly } from "./Weekly.js";
import { Daily } from "./Daily.js";

function MealPlanning(props) {
  const [view, setView] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <div className="planning-page">
      <h1>Welcome to your Meal Planning Dashboard</h1>
      <div className="button-wrapper">
        <div className="left-group">
          <Button type="primary">Edit Meals</Button>
          <Button type="primary">Export Plan</Button>
          <Button type="primary" onClick={() => setCurrentDate(new Date())}>
            Jump to Today
          </Button>
        </div>
        <div className="right-group">
          <Button type="primary" onClick={() => setView("monthly")}>
            Monthly View
          </Button>
          <Button type="primary" onClick={() => setView("weekly")}>
            Weekly View
          </Button>
          <Button type="primary" onClick={() => setView("daily")}>
            Daily View
          </Button>
        </div>
      </div>
      <div className="calendar">
        {view === "monthly" ? (
          <Monthly
            currentDate={currentDate}
            setCurrentDate={(date) => setCurrentDate(date)}
          />
        ) : view === "weekly" ? (
          <Weekly />
        ) : view === "daily" ? (
          <Daily />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default MealPlanning;
