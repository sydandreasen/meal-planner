import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Components/JS/App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  // by default, App is wrapped in React.StrictMode, but removed to remove warning about findDOMNode, which is used by antd Button
  <App />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
