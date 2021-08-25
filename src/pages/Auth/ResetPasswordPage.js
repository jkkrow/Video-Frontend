import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Card from "components/UI/Card";
import Response from "components/FormElement/Response";
import Form from "components/FormElement/Form";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import { useForm } from "hooks/form-hook";
import { VALIDATOR_PASSWORD, VALIDATOR_EQUAL } from "util/validators";
import {
  getResetPassword,
  postResetPassword,
  clearResponse,
} from "store/actions/auth";
import "./ResetPasswordPage.css";
import LoadingSpinner from "components/UI/Loader/LoadingSpinner";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message, access } = useSelector(
    (state) => state.auth
  );
  const { formState, setFormInput } = useForm({
    password: { value: "", isValid: false },
    confirmPassword: { value: "", isValid: false },
  });
  const { token } = useParams();

  const submitHandler = () => {
    if (!formState.isValid) return;

    dispatch(
      postResetPassword(
        formState.inputs.password.value,
        formState.inputs.confirmPassword.value,
        token
      )
    );
  };

  useEffect(() => {
    dispatch(getResetPassword(token));

    return () => dispatch(clearResponse());
  }, [dispatch, token]);

  return (
    <>
      {!access && (
        <div className="reset-password-page">
          <LoadingSpinner on={loading} />
          <Response type="error" content={error} />
        </div>
      )}
      {access && (
        <Card className="reset-password-page">
          <Response
            type={error ? "error" : "message"}
            content={error || message}
          />
          {!message && (
            <Form onSubmit={submitHandler}>
              <Input
                id="password"
                type="password"
                formElement
                autoFocus
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
              <Button loading={loading}>SEND RECOVERY EMAIL</Button>
              {message && <Link to="/auth">Sign in</Link>}
            </Form>
          )}
        </Card>
      )}
    </>
  );
};

export default ResetPasswordPage;
