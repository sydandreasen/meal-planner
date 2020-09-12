import React from "react";
import application from "./Firebase.js";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import "../SCSS/UserHandler.scss";

function Login(props) {
  const handleLogin = async (values) => {
    try {
      await application
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);
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
      <h2>Log in to continue planning meals</h2>
      <Form
        name="login_form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-submit"
          >
            Log In
          </Button>
          <Link to="/signup">Or register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
