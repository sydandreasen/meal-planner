import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import logo from "../../Images/logo.png";
import "../SCSS/App.scss";
import UserHandler from "./UserHandler.js";
import Dashboard from "./Dashboard.js";
import { AuthProvider, AuthContext } from "./Auth.js";
import PrivateRoute from "./PrivateRoute.js";
import application from "./Firebase.js";
import ForgotPassword from "./ForgotPassword.js";

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

  return (
    <div className="App">
      <header>
        <img src={logo} alt={""} />
        <h1>Meal Planner</h1>
      </header>
      {pending ? (
        <div>Loading...</div>
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
                <UserHandler exists={true} />
              </Route>
              <Route exact path="/signup">
                <UserHandler exists={false} />
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
        <img src={logo} alt={""} />A Student-Developed Application. 2020.
      </footer>
    </div>
  );
}

export default App;
