import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router"; // how it gets history of user from routing
import application from "./Firebase.js";
import { AuthContext } from "./Auth.js";

// const SignUp = ({ history }) => {
function SignUp(info) {
  const handleSignUp =
    //   useCallback(
    async (info) => {
      //   info.preventDefault(); // don't do standard button click operation
      //   const { email, password } = event.target.elements; // user info from form
      try {
        await application
          .auth()
          .createUserWithEmailAndPassword(info.email, info.password);
        // history.push("/"); // redirect to root path
        window.location.href = "/";
      } catch (error) {
        alert(error);
      }
    };
  // ,[history]
  //   );
  handleSignUp(info);

  //   const { currentUser } = useContext(AuthContext);
  //   if (currentUser) {
  //     return <Redirect to="/" />;
  //   }
}

// export default withRouter(SignUp);
export default SignUp;
