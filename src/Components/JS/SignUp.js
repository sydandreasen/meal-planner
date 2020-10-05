import React from "react";
import application from "./Firebase.js";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as firebase from "firebase/app";
require("firebase/database");
const db = firebase.database();

function SignUp(props) {
  const handleSignUp = async (values) => {
    try {
      await application
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);
      let user = firebase.auth().currentUser;
      const settingsPathStr = "users/" + user.uid + "/settings";
      let viewSettings = { defaultPage: "planning", defaultView: "weekly" };
      db.ref(settingsPathStr + "/view").set(viewSettings, (error) =>
        error
          ? console.error("Setting view settings failed : ", error)
          : console.log("Writing of View Settings Successful")
      );

      let mealSettings = [
        { name: "Breakfast", key: 1, color: "red" },
        { name: "Lunch", key: 2, color: "blue" },
        { name: "Dinner", key: 3, color: "green" },
      ];
      db.ref(settingsPathStr + "/meals").set(mealSettings, (error) =>
        error
          ? console.error("Setting meal settings failed : ", error)
          : console.log("Writing of Meal Settings Successful")
      );

      let goalSettings = {
        calories: {
          amount: 2000,
          unit: "calories",
        },
        carbohydrates: {
          amount: 275,
          unit: "g",
        },
        fat: {
          amount: 60,
          unit: "g",
        },
        sugar: {
          amount: 50,
          unit: "g",
        },
        protein: {
          amount: 100,
          unit: "g",
        },
      };
      db.ref(settingsPathStr + "/goals").set(goalSettings, (error) =>
        error
          ? console.error("Setting goals settings failed : ", error)
          : console.log("Writing of Goals Settings Successful")
      );
      window.location.href = "/";
    } catch (error) {
      alert(error);
    }
  };

  let hour = new Date().getHours();
  let greeting = "Hello!"; // 12am-5am; 0-5 hours
  if (hour >= 5 && hour < 12) {
    // 5am-12pm
    greeting = "Good Morning!";
  } else if (hour >= 12 && hour < 17) {
    // 12pm-5pm
    greeting = "Good Afternoon!";
  } else if (hour >= 17 && hour < 24) {
    // 5pm-12am
    greeting = "Good Evening!";
  }

  return (
    <div className="userHandler">
      <h1>{greeting}</h1>
      <h2>Sign up to begin planning meals</h2>
      <Form
        name="login_form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSignUp}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email address" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="form-icon" />}
            type="email"
            placeholder="Email Address"
          ></Input>
        </Form.Item>
        <Form.Item name="password">
          <Input
            prefix={<LockOutlined className="item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined className="item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-submit"
          >
            Sign Up
          </Button>
          <Link to="/login">Already registered? Log in</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUp;
