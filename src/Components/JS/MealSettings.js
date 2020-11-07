import React, { useState, useEffect } from "react";
import {
  Badge,
  Popover,
  Tooltip,
  Button,
  Modal,
  Table,
  Popconfirm,
  Input,
  Form,
} from "antd";
import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { updateWChild, writeData, writeWChild } from "./DbHandler.js";
import Reorder, { reorder } from "react-reorder";

// a subset of settings, allowing customization of meal names, order, and colors
function MealSettings(props) {
  const [meals, setMeals] = useState(undefined); // for easy access and management of meal settings
  const [showAddMeal, setShowAddMeal] = useState(false); // modal with form to add meal
  const [showEditMeals, setShowEditMeals] = useState(false); // modal with input and delete icon
  const [form] = Form.useForm(); // add new meal form instance
  const [selectedColor, setSelectedColor] = useState(""); // color of new meal, for styling
  // options for meal colors
  const colors = [
    "pink",
    "red",
    "yellow",
    "orange",
    "cyan",
    "green",
    "blue",
    "purple",
    "geekblue",
    "magenta",
    "volcano",
    "gold",
    "lime",
  ];

  useEffect(() => {
    props.db.ref(props.settingsPathStr).on("value", (snapshot) => {
      // list to DB changes
      setMeals(snapshot.val().meals);
    });
  }, [props.settingsPathStr, props.db]);

  if (meals) {
    return (
      <div>
        <h2>Meal Information</h2>
        <p>
          Edit the number, order, color, and names of your daily meals (that
          includes snacks!)
        </p>
        <Modal
          footer={<div></div>}
          visible={showAddMeal}
          centered={true}
          onCancel={() => setShowAddMeal(false)}
          closeIcon={<CloseCircleOutlined />}
          title={"Add A New Meal"}
        >
          <Form
            className="add-meals"
            form={form}
            onFinish={(values) => {
              let tempMeals = meals.slice();
              tempMeals.push({
                name: values.mealName,
                color: values.mealColor,
                key: meals.length + 1,
              });
              writeData(props.settingsPathStr + "/meals", tempMeals);
              setMeals(tempMeals);
              setSelectedColor("");
              form.resetFields();
              setShowAddMeal(false);
            }}
          >
            <Form.Item
              label="Meal Name"
              name="mealName"
              rules={[{ required: true, message: "Please enter a meal name." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Meal Color"
              name="mealColor"
              rules={[
                { required: true, message: "Please choose a meal color." },
              ]}
            >
              <div>
                {colors.map((color) => (
                  <Badge
                    color={color}
                    key={color}
                    className={color === selectedColor ? "active" : ""}
                    onClick={() => {
                      form.setFieldsValue({ mealColor: color });
                      setSelectedColor(color);
                    }}
                  />
                ))}
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          footer={<div></div>}
          visible={showEditMeals}
          centered={true}
          onCancel={() => setShowEditMeals(false)}
          closeIcon={<CloseCircleOutlined />}
          title={"Edit the Name of Meals or Delete Them"}
        >
          <Table
            dataSource={meals}
            pagination={false}
            columns={[
              {
                title: "Meal Name",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (
                  <Input
                    defaultValue={text}
                    maxLength={15}
                    onChange={(e) => {
                      updateWChild(
                        props.settingsPathStr + "/meals",
                        record.key - 1,
                        { name: e.target.value }
                      );
                    }}
                  />
                ),
              },
              {
                title: "Delete",
                key: "delete",
                render: (text, record) => (
                  <Popconfirm
                    title={`Are you sure you want to delete ${record.name}?`}
                    onConfirm={() => {
                      writeWChild(
                        props.settingsPathStr + "/meals",
                        record.key - 1,
                        null
                      );
                    }}
                    okText="Yes, delete it!"
                    cancelText="No, keep it!"
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                ),
              },
            ]}
            size="small"
          />
        </Modal>
        <div style={{ display: "flex" }}>
          <Button
            onClick={() => setShowAddMeal(true)}
            style={{ margin: "10px", marginTop: "6px" }}
            size="small"
          >
            Add New Meal
          </Button>
          <Button
            onClick={() => setShowEditMeals(true)}
            style={{ margin: "10px", marginTop: "6px" }}
            size="small"
          >
            Edit Existing Meals
          </Button>
        </div>

        <Reorder
          reorderId="meal-list"
          itemKey="name"
          lock="horizontal"
          holdTime={300}
          className="meal-list"
          onReorder={(event, previousIndex, nextIndex, fromId, told) => {
            let tempMeals = meals.slice();
            tempMeals = reorder(tempMeals, previousIndex, nextIndex);
            tempMeals.forEach((meal, index) => (meal.key = index + 1));
            writeData(props.settingsPathStr + "/meals", tempMeals);
            setMeals(tempMeals);
          }}
        >
          {meals.map((meal) => (
            <div className="meal" key={meal.key}>
              <Popover
                title="Customize the meal color"
                trigger="click"
                content={
                  <div>
                    {colors.map((color) => (
                      <Badge
                        key={color}
                        color={color}
                        onClick={() => {
                          let tempMeals = meals.slice();
                          tempMeals[meal.key - 1].color = color;
                          writeData(
                            props.settingsPathStr + "/meals",
                            tempMeals
                          );
                          setMeals(tempMeals);
                        }}
                      />
                    ))}
                  </div>
                }
              >
                <Tooltip
                  placement="rightBottom"
                  title="Click to Customize Color"
                  mouseLeaveDelay={0}
                >
                  <Badge color={meal.color} />{" "}
                </Tooltip>
              </Popover>

              <p>{meal.name}</p>
            </div>
          ))}
        </Reorder>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default MealSettings;
