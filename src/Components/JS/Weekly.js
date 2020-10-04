import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Descriptions, Tooltip, Badge } from "antd";
import { dayNutrients, mealNutrients, foodNutrients } from "./Commons.js";
import "../SCSS/Weekly.scss";

export const Weekly = (props) => {
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
  const daysInWeek = [0, 1, 2, 3, 4, 5, 6];

  // generate array of dates with length 7, ordered Sunday-Saturday
  let dates = [new Date(currentDate)];
  let weekday = currentDate.getDay();
  for (let i = 0; i < weekday; i++) {
    let newDate = new Date(dates[0]);
    newDate.setDate(newDate.getDate() - 1);
    dates.unshift(newDate);
  }
  for (let i = 0; i < 7 - weekday - 1; i++) {
    let newDate = new Date(dates[dates.length - 1]);
    newDate.setDate(newDate.getDate() + 1);
    dates.push(newDate);
  }

  // find string for date range in week depending if range is in same month/year
  let startMonth = dates[0].getMonth();
  let endMonth = dates[dates.length - 1].getMonth();
  let startYear = dates[0].getFullYear();
  let endYear = dates[dates.length - 1].getFullYear();
  let rangeStr = "";
  if (startYear === endYear) {
    if (startMonth === endMonth) {
      rangeStr = `${months[startMonth]} ${dates[0].getDate()} - ${dates[
        dates.length - 1
      ].getDate()}, ${startYear}`;
    } else {
      rangeStr = `${months[startMonth]} ${dates[0].getDate()} - ${
        months[endMonth]
      } ${dates[dates.length - 1].getDate()}, ${startYear}`;
    }
  } else {
    rangeStr = `${months[startMonth]} ${dates[0].getDate()}, ${startYear} - ${
      months[endMonth]
    } ${dates[dates.length - 1].getDate()}, ${endYear}`;
  }

  return (
    <div className="weekly">
      <div className="header">
        <Tooltip title="Previous Week" color={"black"}>
          <LeftOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(startYear, startMonth, currentDate.getDate() - 7)
              );
            }}
          />
        </Tooltip>
        <h2>{rangeStr}</h2>
        <Tooltip title="Next Week" color={"black"}>
          <RightOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(endYear, endMonth, currentDate.getDate() + 7)
              );
            }}
          />
        </Tooltip>
        <table>
          <thead>
            <tr>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {daysInWeek.map((weekday) => (
                <WeekdayCard
                  key={weekday}
                  date={dates[weekday]}
                  currentDate={currentDate}
                  setCurrentDate={props.setCurrentDate}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const WeekdayCard = (props) => {
  let dateCompare1 = props.date.toDateString();
  let dateCompare2 = props.currentDate.toDateString();
  let dayClassName =
    dateCompare1 === dateCompare2 ? "weekday-card selected" : "weekday-card";

  return (
    <td
      className={dayClassName}
      onClick={() => props.setCurrentDate(props.date)}
    >
      <div className="day-num">
        <p>{props.date.getDate()}</p>
      </div>
      <div className="total-cals">
        {dayNutrients.cals ? dayNutrients.cals : 0} cals
      </div>
      <div className="meals">
        <WeeklyMeal color={"red"} mealName={"Breakfast"} />
        <WeeklyMeal color={"blue"} mealName={"Lunch"} />
        <WeeklyMeal color={"green"} mealName={"Dinner"} />
      </div>
    </td>
  );
};

export const WeeklyMeal = (props) => {
  return (
    <Descriptions
      title={
        <Badge
          color={props.color}
          text={`${props.mealName} : ${
            mealNutrients.cals ? mealNutrients.cals : 0
          } cals`}
        />
      }
      column={1}
      size={"small"}
      className={"meal"}
    >
      {mealNutrients.cals ? (
        <Descriptions.Item label={""}>{foodNutrients.cals}</Descriptions.Item>
      ) : (
        <Descriptions.Item label={"No Foods"}>Add Some!</Descriptions.Item>
      )}
    </Descriptions>
  );
};
