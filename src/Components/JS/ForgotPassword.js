import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button } from "antd";
import "../SCSS/ForgotPassword.scss";
import { auth } from "./Firebase.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  //   const onChangeHandler = (values) => {
  //     const { name, value } = event.currentTarget;
  //     if (name === "userEmail") {
  //       setEmail(value);
  //     }
  //   };
  const sendResetEmail = (values) => {
    // event.preventDefault();
    setEmail(values.email);
    auth
      .sendPasswordResetEmail(values.email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {
          setEmailHasBeenSent(false);
        }, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  return (
    <div>
      <h1>Need to Reset Your Password?</h1>
      <h2>No Problem! Send Yourself a Link to Reset it!</h2>

      {emailHasBeenSent ? <h3>An email has been sent to {email}.</h3> : ""}
      {error !== null ? alert(error) : ""}
      {!emailHasBeenSent && error == null ? (
        <Form className="form" onFinish={sendResetEmail}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
            ]}
          >
            <Input type="email" placeholder="Email Address" />
          </Form.Item>
          <Button className="form-submit" type="primary" htmlType="submit">
            Send the link!
          </Button>
        </Form>
      ) : (
        ""
      )}
      <Link to="/login" className="back">
        <a href="">Back to Login</a>
      </Link>
    </div>
  );
};

export default ForgotPassword;
