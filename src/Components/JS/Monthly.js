import React, { useState } from "react";
import { Description, Descriptions, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import "../SCSS/Monthly.scss";

export const Monthly = (props) => {
  const today = new Date();
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
  console.log(dates);
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
        <tr>
          <th>Sunday</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
        </tr>
        <tr>
          <Week weekNum={1} dates={dates} />
        </tr>
        <tr>
          <Week weekNum={2} dates={dates} />
        </tr>
        <tr>
          <Week weekNum={3} dates={dates} />
        </tr>
        <tr>
          <Week weekNum={4} dates={dates} />
        </tr>
        <tr>
          <Week weekNum={5} dates={dates} />
        </tr>
      </table>
      {/* {days.map((day) => (
        <DayCard dayNum={day} />
      ))} */}
    </div>
  );
};

export const MonthlyMeal = (props) => {
  const className = `meal ${props.color}`;
  return (
    <Descriptions
      title=""
      boredered
      column={1}
      size={"small"}
      className={className}
    >
      <Descriptions.Item label={props.mealName}>1234 cals</Descriptions.Item>
    </Descriptions>
  );
};

export const DayCard = (props) => {
  let dayClassName = props.inCurrentMonth
    ? "day-card"
    : "day-card inactive-month";
  return (
    <td className={dayClassName}>
      <div className="day-num">
        <p>{props.dayNum}</p>
      </div>
      <div className="total-cals">Total : 3702 cals</div>
      <div className="meals">
        <MonthlyMeal
          color={props.inCurrentMonth ? "red" : "lightred"}
          mealName="Breakfast"
        />
        <MonthlyMeal
          color={props.inCurrentMonth ? "blue" : "lightblue"}
          mealName="Lunch"
        />
        <MonthlyMeal
          color={props.inCurrentMonth ? "green" : "lightgreen"}
          mealName="Dinner"
        />
      </div>
    </td>
  );
};

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
  console.log();
  return daysInWeek.map((dayObj) => (
    <DayCard
      dayNum={dayObj.date.getDate()}
      inCurrentMonth={dayObj.inCurrentMonth}
    />
  ));
};
