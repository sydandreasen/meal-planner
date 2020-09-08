import React, { useState } from "react";
import application from "../../Firebase";
import { Button } from "antd";

function Dashboard(props) {
  return (
    <div>
      <h1>Welcome to your dashboard.</h1>
      <Button type="primary" onClick={() => application.auth().signOut()}>
        Sign out
      </Button>
    </div>
  );
}

export default Dashboard;
