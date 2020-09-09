import application from "./Firebase.js";

function SignUp(info) {
  const handleSignUp = async (info) => {
    try {
      await application
        .auth()
        .createUserWithEmailAndPassword(info.email, info.password);
      window.location.href = "/";
    } catch (error) {
      alert(error);
    }
  };
  handleSignUp(info);
}

export default SignUp;
