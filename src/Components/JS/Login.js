import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router"; // how it gets history of user from routing
import application from "./Firebase.js";
import { AuthContext } from "./Auth.js";

// const Login = ({ history }) => {
function Login(info) {
  const handleLogin =
    //   useCallback(
    async (info) => {
      //   info.preventDefault(); // don't do standard button click operation
      //   const { email, password } = event.target.elements; // user info from form
      try {
        await application
          .auth()
          .signInWithEmailAndPassword(info.email, info.password);
        // history.push("/"); // redirect to root path
        window.location.href = "/";
      } catch (error) {
        alert(error);
      }
    };
  // ,[history]
  //   );
  handleLogin(info);

  //   const { currentUser } = useContext(AuthContext);
  //   if (currentUser) {
  //     return <Redirect to="/" />;
  //   }
}

// export default withRouter(Login);
export default Login;
