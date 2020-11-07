import React from "react";
import error from "../../Images/404error.png";

// 404 error page
const ErrorPage = (props) => {
  return (
    <div>
      <h1>it seems the page you are looking for does not exist</h1>
      <img alt="404 error" src={error} width={"400vw"} />
    </div>
  );
};

export default ErrorPage;
