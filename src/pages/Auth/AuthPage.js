import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import Card from "components/UI/Card";
import Response from "components/FormElement/Response";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import GoogleLoginButton from "components/Auth/GoogleLoginButton";
import { useForm } from "hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_PASSWORD,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EQUAL,
} from "util/validators";
import {
  register,
  login,
  googleLogin,
  googleLoginError,
  clearError,
} from "store/actions/auth";
import "./AuthPage.css";

const AuthPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const { formState, setFormInput, setFormData } = useForm({
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
  });
  const [isLogin, setIsLogin] = useState(true);

  const googleLoginHandler = (googleData) => {
    dispatch(googleLogin(googleData));
  };

  const googleLoginErrorHandler = (err) => {
    dispatch(googleLoginError(err));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (isLogin) {
      dispatch(
        login(formState.inputs.email.value, formState.inputs.password.value)
      );
    } else {
      dispatch(
        register(
          formState.inputs.name.value,
          formState.inputs.email.value,
          formState.inputs.password.value,
          formState.inputs.confirmPassword.value,
          () => setIsLogin(true)
        )
      );
    }
  };

  const toggleMode = () => {
    dispatch(clearError());

    setIsLogin((prevMode) => {
      if (prevMode) {
        setFormData(
          {
            name: { value: "", isValid: false },
            email: formState.inputs.email,
            password: { value: "", isValid: false },
            confirmPassword: { value: "", isValid: false },
          },
          false
        );
      } else {
        setFormData(
          {
            email: formState.inputs.email,
            password: { value: "", isValid: false },
          },
          false
        );
      }
      return !prevMode;
    });
  };

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  return (
    <Card className="auth-page">
      <LoadingSpinner on={loading} />
      <Response type={error ? "error" : "message"} content={error || message} />
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <Input
            id="name"
            type="text"
            formElement
            placeholder="Name *"
            message="At least 4 characters"
            autoFocus
            validators={[VALIDATOR_MINLENGTH(4)]}
            onForm={setFormInput}
          />
        )}
        <Input
          id="email"
          type="text"
          formElement
          placeholder="Email *"
          validators={[VALIDATOR_EMAIL()]}
          onForm={setFormInput}
        />
        {isLogin && (
          <Input
            id="password"
            type="password"
            formElement
            placeholder="Password *"
            validators={[VALIDATOR_REQUIRE()]}
            onForm={setFormInput}
          />
        )}
        {!isLogin && (
          <Input
            id="password"
            type="password"
            formElement
            placeholder="Password *"
            message="At least 8 characters with lowercase, uppercase, number, and special character"
            validators={[VALIDATOR_PASSWORD()]}
            onForm={setFormInput}
          />
        )}
        {!isLogin && (
          <Input
            id="confirmPassword"
            type="password"
            formElement
            placeholder="Confirm Password *"
            validators={[VALIDATOR_EQUAL(formState.inputs.password.value)]}
            onForm={setFormInput}
          />
        )}
        <Button disabled={!formState.isValid}>
          {isLogin ? "SIGN IN" : "SIGN UP"}
        </Button>
      </form>
      <GoogleLoginButton
        onLoginSuccess={googleLoginHandler}
        onLoginFail={googleLoginErrorHandler}
      />
      {isLogin ? (
        <p>
          Don't have an account? <span onClick={toggleMode}>Sign up</span>
        </p>
      ) : (
        <p>
          Already have an account? <span onClick={toggleMode}>Sign in</span>
        </p>
      )}
    </Card>
  );
};

export default AuthPage;
