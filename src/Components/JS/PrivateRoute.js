import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth.js";

// component is component to be rendered if user is authenticated
// rest covers any other props
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(
        routeProps // determine which to render via currentUser
      ) =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to="/login" /> // authentication failed
        )
      }
    />
  );
};

export default PrivateRoute;
