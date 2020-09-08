import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import logo from "./Images/logo.png";
import "./App.scss";
import UserHandler from "./UserHandler.js";
import Dashboard from "./Dashboard.js";
import { AuthProvider } from "./Auth.js";

function App() {
  const loggedIn = false;

  return (
    <div className="App">
      <header>
        <img src={logo} alt={""} />
        <h1>Meal Planner</h1>
      </header>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/">
              {loggedIn ? (
                <Redirect to="/dashboard" />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/dashboard">
              hello world
            </Route>
            <Route exact path="/login">
              <UserHandler exists={true} />
            </Route>
            <Route exact path="/signup">
              <UserHandler exists={false} />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>

      <footer>
        <img src={logo} alt={""} />A Student-Developed Application. 2020.
      </footer>
    </div>
  );
}

export default App;
