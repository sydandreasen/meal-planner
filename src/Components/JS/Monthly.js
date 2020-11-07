import React from "react";
import { Tooltip, Badge } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  DashOutlined,
} from "@ant-design/icons";
import "../SCSS/Monthly.scss";

// the monthly meal planning view
export const Monthly = (props) => {
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
  let currentMonth = currentDate.getMonth();
  let monthName = months[currentMonth];
  let currentYear = currentDate.getFullYear();
  // note that months are normally indexed 0-11 and dates 1-31,
  // but when given date 0, that will give the day before the first in the
  // 0-11 indexed month aka the last day of the month with the actually month number
  // so, in september, getMonth() returns 8. To get the last day of September, use month = 9,
  // and date = 0
  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      date: new Date(currentYear, currentMonth, i),
      inCurrentMonth: true,
    });
  }
  let weekday = dates[0].date.getDay(); // sunday = 0
  // use day of week of first day of current month to determine how many dates
  // need to be added to the beginning and end for the previous and following months, respectively
  for (let i = 0; i < weekday; i++) {
    let newDate = new Date(dates[0].date);
    newDate.setDate(newDate.getDate() - 1);
    dates.unshift({ date: newDate, inCurrentMonth: false });
  }
  for (let i = 0; i < 35 - daysInMonth - weekday; i++) {
    let newDate = new Date(dates[dates.length - 1].date);
    newDate.setDate(newDate.getDate() + 1);
    dates.push({ date: newDate, inCurrentMonth: false });
  }
  return (
    <div className="monthly">
      <div className="header">
        <Tooltip title="12 Months Previous" color={"black"}>
          <DoubleLeftOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(currentYear - 1, currentMonth, currentDate.getDate())
              );
            }}
          />
        </Tooltip>
        <Tooltip title="Previous Month" color={"black"}>
          <LeftOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(currentYear, currentMonth - 1, currentDate.getDate())
              );
            }}
          />
        </Tooltip>
        <h2>{`${monthName} ${currentYear}`}</h2>
        <Tooltip title="Next Month" color={"black"}>
          <RightOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(currentYear, currentMonth + 1, currentDate.getDate())
              );
            }}
          />
        </Tooltip>
        <Tooltip title="12 Months Forward" color={"black"}>
          <DoubleRightOutlined
            className="nav-icon"
            onClick={() => {
              props.setCurrentDate(
                new Date(currentYear + 1, currentMonth, currentDate.getDate())
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
            <Week
              mealSettings={props.mealSettings}
              weekNum={1}
              dates={dates}
              currentDate={currentDate}
              setCurrentDate={props.setCurrentDate}
              plans={props.plans}
            />
          </tr>
        </tbody>
        <tbody>
          <tr>
            <Week
              mealSettings={props.mealSettings}
              weekNum={2}
              dates={dates}
              currentDate={currentDate}
              setCurrentDate={props.setCurrentDate}
              plans={props.plans}
            />
          </tr>
        </tbody>
        <tbody>
          <tr>
            <Week
              mealSettings={props.mealSettings}
              weekNum={3}
              dates={dates}
              currentDate={currentDate}
              setCurrentDate={props.setCurrentDate}
              plans={props.plans}
            />
          </tr>
        </tbody>
        <tbody>
          <tr>
            <Week
              mealSettings={props.mealSettings}
              weekNum={4}
              dates={dates}
              currentDate={currentDate}
              setCurrentDate={props.setCurrentDate}
              plans={props.plans}
            />
          </tr>
        </tbody>
        <tbody>
          <tr>
            <Week
              mealSettings={props.mealSettings}
              weekNum={5}
              dates={dates}
              currentDate={currentDate}
              setCurrentDate={props.setCurrentDate}
              plans={props.plans}
            />
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

// individual meals to be repeated within each day
export const MonthlyMeal = (props) => {
  return (
    <div>
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

// individual days to be repeated in the week
export const DayCard = (props) => {
  let dateCompare1 = props.date.toDateString();
  let dateCompare2 = props.currentDate.toDateString();
  let dayClassName =
    props.inCurrentMonth && dateCompare1 === dateCompare2
      ? "day-card selected"
      : props.inCurrentMonth
      ? "day-card"
      : "day-card inactive-month";

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
          <MonthlyMeal
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

// individual weeks to be repeated inside the month
export const Week = (props) => {
  const weekToMatch = props.weekNum;
  let daysInWeek = [];
  let weekCounter = 1;
  for (let i = 0; i < 35; i++) {
    if (weekCounter === weekToMatch) {
      daysInWeek.push(props.dates[i]);
    }
    if (Math.ceil(props.dates[i].date.getDay()) === 6) {
      weekCounter++;
    }
  }
  return daysInWeek.map((dayObj) => (
    <DayCard
      mealSettings={props.mealSettings}
      key={dayObj.date}
      date={dayObj.date}
      currentDate={props.currentDate}
      inCurrentMonth={dayObj.inCurrentMonth}
      setCurrentDate={props.setCurrentDate}
      plans={
        props.plans
          ? props.plans[
              `${dayObj.date.getFullYear()}-${
                dayObj.date.getMonth() + 1 > 9
                  ? dayObj.date.getMonth() + 1
                  : `0${dayObj.date.getMonth() + 1}`
              }-${
                dayObj.date.getDate() > 9
                  ? dayObj.date.getDate()
                  : `0${dayObj.date.getDate()}`
              }`
            ]
          : {}
      }
    />
  ));
};
