import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  InputNumber,
  Button,
  Select,
  Modal,
  Descriptions,
  DatePicker,
} from "antd";
import "../SCSS/MealPlanning.scss";
import { Monthly } from "./Monthly.js";
import { Weekly } from "./Weekly.js";
import { Daily } from "./Daily.js";
import {
  CloseCircleOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

function MealPlanning(props) {
  const [view, setView] = useState(props.defaultView);
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
  const [showFoodInfo, setShowFoodInfo] = useState(false);
  const [foodInfo, setFoodInfo] = useState([]);
  const [foodName, setFoodName] = useState("");
  const getFood = async (searchStr) => {
    if (searchStr) {
      // get the URL encorded for the parser request
      const foodStr = searchStr.replace(" ", "%20");
      const parserReq = `https://api.edamam.com/api/food-database/v2/parser?ingr=${foodStr}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`;

      // get info from parser request to give to nutrients request
      let foodId = "";
      let servURI = "";
      let quantity = 1;

      // parser request
      await axios
        .get(parserReq)
        .then((response) => {
          setFoodName(response.data.text);
          foodId = response.data.hints[0].food.foodId;
          console.log(foodId);
          // find which measure is for serving
          response.data.hints[0].measures.forEach((measure) => {
            if (measure.label === "Serving") {
              servURI = measure.uri;
            }
          });
        })
        .catch(() => console.error("Parser GET request failed."));

      // nutrients request
      await axios
        .post(
          `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`,
          {
            ingredients: [
              {
                quantity: quantity,
                measureURI: servURI,
                foodId: foodId,
              },
            ],
          }
        )
        .then((response) => {
          let tempInfo = [];
          tempInfo[0] = {
            label: "Calories",
            quantity: response.data.calories,
            unit: "cals",
          };
          let nutrientNames = Object.getOwnPropertyNames(
            response.data.totalNutrients
          );
          nutrientNames.forEach((nutrient) => {
            tempInfo.push({
              label: response.data.totalNutrients[nutrient].label,
              quantity: response.data.totalNutrients[nutrient].quantity,
              unit: response.data.totalNutrients[nutrient].unit,
            });
          });
          setFoodInfo(tempInfo);
          setShowFoodInfo(true);
        })
        .catch(() => console.error("Nutrients POST request failed."));
    }
  };

  return (
    <Modal
      className="search"
      footer={<div></div>}
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

      {showFoodInfo ? <FoodInfo food={foodName} nutrients={foodInfo} /> : ""}
    </Modal>
  );
};

export const FoodInfo = (props) => {
  const [showNutrients, setShowNutrients] = useState(true);

  return (
    <div className="food-wrapper">
      <div className="head">
        <h3>{`${props.food} (1 Serving)`}</h3>
        <Button
          type="primary"
          icon={
            showNutrients ? <PlusCircleOutlined /> : <MinusCircleOutlined />
          }
          onClick={() => setShowNutrients(!showNutrients)}
        >
          Add to Plan
        </Button>
      </div>
      {showNutrients ? (
        <Descriptions
          bordered
          column={1}
          size={"small"}
          className={"food-info"}
        >
          {props.nutrients.map((nutrient, index) => (
            <Descriptions.Item
              key={index}
              label={`${nutrient.label} (${nutrient.unit})`}
            >
              {nutrient.quantity.toFixed(2)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <div className="add-food">
          <DatePicker
            placeholder="Select a date to plan this food"
            onChange={(date, dateString) =>
              console.log("date selected:", dateString)
            }
          />
          <Select placeholder="Select a meal to plan this food">
            <Option value="breakfast">Breakfast</Option>
            <Option value="lunch">Lunch</Option>
            <Option value="dinner">Dinner</Option>
          </Select>
          <br />
          <p>
            Quantity :
            <InputNumber style={{ margin: "10px" }} defaultValue={1} />
          </p>

          <br />
          <Button icon={<PlusCircleOutlined />}>Add it!</Button>
        </div>
      )}
    </div>
  );
};

export default MealPlanning;
