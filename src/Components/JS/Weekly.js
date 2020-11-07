import React from "react";
import { LeftOutlined, RightOutlined, DashOutlined } from "@ant-design/icons";
import { Tooltip, Badge } from "antd";
import "../SCSS/Weekly.scss";

// weekly meal planning view
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
      </div>
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
                mealSettings={props.mealSettings}
                key={weekday}
                date={dates[weekday]}
                currentDate={currentDate}
                setCurrentDate={props.setCurrentDate}
                plans={
                  props.plans
                    ? props.plans[
                        `${dates[weekday].getFullYear()}-${
                          dates[weekday].getMonth() + 1 > 9
                            ? dates[weekday].getMonth() + 1
                            : `0${dates[weekday].getMonth() + 1}`
                        }-${
                          dates[weekday].getDate() > 9
                            ? dates[weekday].getDate()
                            : `0${dates[weekday].getDate()}`
                        }`
                      ]
                    : {}
                }
              />
            ))}
          </tr>
        </tbody>
      </table>
      <p>
        *Due to restrictions on the number of API calls, please go to a single
        day's view to see nutrition information.*
      </p>
    </div>
  );
};

// a single day's card containing all the meals and total cals for the day
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
      <div className="meals">
        {props.mealSettings.map((meal) => (
          <WeeklyMeal
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
      </div>
    </td>
  );
};

// individual meals to be repeated within a single day
export const WeeklyMeal = (props) => {
  return (
    <div className="meal">
      <Badge color={props.color} text={props.mealName} />
      <div className="foods">
        {props.plans ? (
          props.plans.map((food, index) => (
            <p key={index} className="food">
              {food.name}
            </p>
          ))
        ) : (
          <DashOutlined className="food" />
        )}
      </div>
    </div>
  );
};
