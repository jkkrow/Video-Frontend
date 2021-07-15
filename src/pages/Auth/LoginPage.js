import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import Card from "components/UI/Card";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import GoogleLoginButton from "components/Auth/GoogleLoginButton";
import { useForm } from "hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from "util/validators";
import { login, googleLogin } from "store/actions/auth";
import "./LoginPage.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { formState, inputHandler } = useForm({
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
  });

  const googleLoginHandler = (googleData) => {
    dispatch(googleLogin(googleData));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    dispatch(
      login(formState.inputs.email.value, formState.inputs.password.value)
    );
  };

  return (
    <Card className="login-page">
      <LoadingSpinner on={loading} />
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          formElement
          placeholder="Email *"
          validators={[VALIDATOR_EMAIL()]}
          onForm={inputHandler}
        />
        <Input
          id="password"
          type="password"
          formElement
          placeholder="Password *"
          validators={[VALIDATOR_REQUIRE()]}
          onForm={inputHandler}
        />
        <Button disabled={!formState.isValid}>SIGN IN</Button>
      </form>
      <GoogleLoginButton onLogin={googleLoginHandler} />
    </Card>
  );
};

export default LoginPage;
