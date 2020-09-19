import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Spin } from "antd";
import logo from "../../Images/logo.png";
import "../SCSS/App.scss";
import Login from "./Login.js";
import SignUp from "./SignUp.js";
import Dashboard from "./Dashboard.js";
import { AuthProvider } from "./Auth.js";
import PrivateRoute from "./PrivateRoute.js";
import application from "./Firebase.js";
import ForgotPassword from "./ForgotPassword.js";
import { loadingMessage } from "./Commons.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  // when authentication state changes, set the user
  useEffect(() => {
    application.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false); // pending = false after setCurrentUserComplete, allows proper AuthContext.Provided return
    });
  }, []);

  let message = loadingMessage();

  return (
    <div className="App">
      <header>
        <img src={logo} alt={""} />
        <h1>Meal Planner</h1>
      </header>
      {pending ? (
        <div>
          <h1>{message}</h1>
          <Spin size={"large"} spinning={true} />
        </div>
      ) : (
        <AuthProvider>
          <Router>
            <Switch>
              <Route exact path="/">
                {!!currentUser ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/login" />
                )}
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <SignUp />
              </Route>
              <PrivateRoute exact path="/dashboard">
                {!!currentUser ? <Dashboard /> : <Redirect to="/login" />}
              </PrivateRoute>
              <Route exact path="/forgot-password">
                <ForgotPassword />
              </Route>
            </Switch>
          </Router>
        </AuthProvider>
      )}

      <footer>
        <div className="mine">
          <img src={logo} alt={""} />A Student-Developed Application. 2020.
        </div>
        <div id="edamam-badge" data-color="transparent"></div>
      </footer>
    </div>
  );
}

export default App;
