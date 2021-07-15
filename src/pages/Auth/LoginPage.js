import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import Card from "components/UI/Card";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import GoogleLoginButton from "components/Auth/GoogleLoginButton";
import { googleLogin } from "store/actions/auth";
import "./LoginPage.css";

const LoginPage = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const googleLoginHandler = (googleData) => {
    dispatch(googleLogin(googleData));
  };

  return (
    <Card className="login-page">
      <LoadingSpinner on={loading} />
      <Input placeholder="Email *" />
      <Input placeholder="Password *" />
      <Button>SIGN IN</Button>
      <GoogleLoginButton onLogin={googleLoginHandler} />
    </Card>
  );
};

export default LoginPage;
