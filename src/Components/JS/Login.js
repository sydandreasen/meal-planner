import application from "./Firebase.js";

function Login(info) {
  const handleLogin = async (info) => {
    try {
      await application
        .auth()
        .signInWithEmailAndPassword(info.email, info.password);
      window.location.href = "/";
    } catch (error) {
      alert(error);
    }
  };
  handleLogin(info);
}

export default Login;
