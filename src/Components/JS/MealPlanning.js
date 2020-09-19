import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Select, Modal, Descriptions } from "antd";
import "../SCSS/MealPlanning.scss";
import { Monthly } from "./Monthly.js";
import { Weekly } from "./Weekly.js";
import { Daily } from "./Daily.js";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

function MealPlanning(props) {
  const [view, setView] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="planning-page">
      <h1>Welcome to your Meal Planning Dashboard</h1>
      <div className="button-wrapper">
        <div className="left-group">
          <Button type="primary" onClick={() => setShowSearch(!showSearch)}>
            Add Food
          </Button>
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
      <Search
        visible={showSearch}
        setShowSearch={(bool) => setShowSearch(bool)}
      />
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

export const Search = (props) => {
  const [searchStr, setSearchStr] = useState("");
  const [foodInfo, setFoodInfo] = useState(null);
  const getFood = (searchStr) => {
    if (searchStr) {
      const foodStr = searchStr.replace(" ", "%20");
      const parserReq = `https://api.edamam.com/api/food-database/v2/parser?ingr=${foodStr}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`;
      axios
        .get(parserReq)
        .then((response) => {
          setFoodInfo(response.data);
          console.log(JSON.stringify(response.data.parsed[0].food.nutrients));
        })
        .catch((error) => console.error(error));
    }
  };
  console.log(foodInfo);

  return (
    <Modal
      className="search"
      footer={[<div></div>]}
      visible={props.visible}
      onCancel={() => props.setShowSearch(false)}
      centered={true}
      closeIcon={<CloseCircleOutlined />}
      title="Food Search"
    >
      <Input
        placeholder="Search for a Food"
        onChange={(e) => setSearchStr(e.target.value)}
        onPressEnter={() => getFood(searchStr)}
      />
      <Button type="primary" onClick={() => getFood(searchStr)}>
        Search
      </Button>

      {foodInfo &&
      foodInfo.parsed &&
      foodInfo.parsed[0].food &&
      foodInfo.parsed[0].food.nutrients ? (
        <FoodInfo
          food={searchStr}
          nutrients={foodInfo.parsed[0].food.nutrients}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};

export const FoodInfo = (props) => {
  const cals = props.nutrients.ENERC_KCAL;
  const prot = props.nutrients.PROCNT;
  const carbs = props.nutrients.CHOCDF;
  const fat = props.nutrients.FAT;
  const fiber = props.nutrients.FIBTG;
  return (
    <Descriptions title={props.food} bordered column={1} size={"small"}>
      <Descriptions.Item label="Calories">{cals}</Descriptions.Item>
      <Descriptions.Item label="Protein (g)">{prot}</Descriptions.Item>
      <Descriptions.Item label="Cabohydrates (g)">{carbs}</Descriptions.Item>
      <Descriptions.Item label="Fat (g)">{fat}</Descriptions.Item>
      <Descriptions.Item label="Fiber (g)">{fiber}</Descriptions.Item>
    </Descriptions>
  );
};

export default MealPlanning;
