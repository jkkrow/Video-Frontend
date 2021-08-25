import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "components/UI/Card";
import Response from "components/FormElement/Response";
import Form from "components/FormElement/Form";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import { useForm } from "hooks/form-hook";
import { VALIDATOR_EMAIL } from "util/validators";
import { sendRecoveryEmail, clearResponse } from "store/actions/auth";
import "./SendRecoveryEmailPage.css";

const SendRecoveryEmailPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const { formState, setFormInput } = useForm({
    email: { value: "", isValid: false },
  });

  const submitHandler = () => {
    if (!formState.isValid) return;

    dispatch(sendRecoveryEmail(formState.inputs.email.value));
  };

  useEffect(() => {
    return () => dispatch(clearResponse());
  }, [dispatch]);

  return (
    <Card className="auth-page">
      <Response type={error ? "error" : "message"} content={error || message} />
      {!message && (
        <Form onSubmit={submitHandler}>
          <Input
            id="email"
            type="text"
            formElement
            autoFocus
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Button loading={loading}>SEND RECOVERY EMAIL</Button>
        </Form>
      )}
    </Card>
  );
};

export default SendRecoveryEmailPage;
