import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Card from "components/UI/Card";
import Response from "components/FormElement/Response";
import Form from "components/FormElement/Form";
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
  clearResponse,
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

  const submitHandler = () => {
    if (!formState.isValid) return;

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
    dispatch(clearResponse());

    setIsLogin((prevMode) => {
      if (prevMode) {
        setFormData(
          {
            name: { value: "", isValid: false },
            email: { value: "", isValid: false },
            password: { value: "", isValid: false },
            confirmPassword: { value: "", isValid: false },
          },
          false
        );
      } else {
        setFormData(
          {
            email: { value: "", isValid: false },
            password: { value: "", isValid: false },
          },
          false
        );
      }
      return !prevMode;
    });
  };

  useEffect(() => {
    return () => dispatch(clearResponse());
  }, [dispatch]);

  return (
    <Card className="auth-page">
      <Response type={error ? "error" : "message"} content={error || message} />
      {isLogin && (
        <Form onSubmit={submitHandler}>
          <Input
            id="email"
            type="text"
            formElement
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Input
            id="password"
            type="password"
            formElement
            autoComplete="current-password"
            label="Password *"
            validators={[VALIDATOR_REQUIRE()]}
            onForm={setFormInput}
          />
          <Link to="/auth/send-recovery-email">Forgot Password</Link>
          <Button loading={loading}>SIGN IN</Button>
        </Form>
      )}
      {!isLogin && (
        <Form onSubmit={submitHandler}>
          <Input
            id="name"
            type="text"
            formElement
            autoFocus
            autoComplete="name"
            label="Name *"
            message="At least 4 characters"
            validators={[VALIDATOR_MINLENGTH(4)]}
            onForm={setFormInput}
          />
          <Input
            id="email"
            type="text"
            formElement
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Input
            id="password"
            type="password"
            formElement
            autoComplete="new-password"
            label="Password *"
            message="At least 8 characters with lowercase, uppercase, number, and special character"
            validators={[VALIDATOR_PASSWORD()]}
            onForm={setFormInput}
          />
          <Input
            id="confirmPassword"
            type="password"
            formElement
            autoComplete="new-password"
            label="Confirm Password *"
            validators={[VALIDATOR_EQUAL(formState.inputs.password.value)]}
            onForm={setFormInput}
          />
          <Button loading={loading}>SIGN UP</Button>
        </Form>
      )}
      <GoogleLoginButton
        onLoginSuccess={googleLoginHandler}
        onLoginFail={googleLoginErrorHandler}
      />
      {isLogin ? (
        <p>
          Don't have an account?{" "}
          <span className="link" onClick={toggleMode}>
            Sign up
          </span>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <span className="link" onClick={toggleMode}>
            Sign in
          </span>
        </p>
      )}
    </Card>
  );
};

export default AuthPage;
