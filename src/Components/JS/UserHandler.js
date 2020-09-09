import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import "../SCSS/UserHandler.scss";
import SignUp from "./SignUp.js";
import Login from "./Login.js";

function UserHandler(props) {
  const onFinish = (values) => {
    !!props.exists ? Login(values) : SignUp(values);
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
      <h2>
        {props.exists ? "Log in to continue" : "Sign up to begin"} planning
        meals
      </h2>
      <Form
        name="login_form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
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
        {props.exists ? (
          <Form.Item className="remember-forgot">
            {/* <Form.Item
              name="remember"
              className="remember-me"
              valuePropName="checked"
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}
            <Link to="/forgot-password" className="forgot-password">
              Forgot password
            </Link>
          </Form.Item>
        ) : (
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
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-submit"
          >
            {props.exists ? "Log In" : "Sign Up"}
          </Button>
          <Link to={props.exists ? "/signup" : "/login"}>
            {props.exists ? " Or register now!" : "Already registered? Log in"}
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserHandler;
