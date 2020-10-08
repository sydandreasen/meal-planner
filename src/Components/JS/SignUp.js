import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { writeData } from "./DbHandler.js";
import base from "./Firebase.js";

function SignUp(props) {
  const handleSignUp = async (values) => {
    try {
      await base
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);
      let user = base.auth().currentUser;
      const settingsPathStr = "users/" + user.uid + "/settings";
      let viewSettings = { defaultPage: "planning", defaultView: "weekly" };
      writeData(settingsPathStr + "/view", viewSettings);

      let mealSettings = [
        { name: "Breakfast", key: 1, color: "red" },
        { name: "Lunch", key: 2, color: "blue" },
        { name: "Dinner", key: 3, color: "green" },
      ];
      writeData(settingsPathStr + "/meals", mealSettings);

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
      writeData(settingsPathStr + "/goals", goalSettings);

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
