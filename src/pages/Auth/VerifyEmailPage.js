import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import Response from "components/FormElement/Response";
import { verifyEmail, clearResponse } from "store/actions/auth";
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const { token } = useParams();

  useEffect(() => {
    dispatch(verifyEmail(token));

    return () => dispatch(clearResponse());
  }, [dispatch, token]);

  return (
    <div className="verify-email-page">
      <LoadingSpinner on={loading} />
      <Response type={error ? "error" : "message"} content={error || message} />
    </div>
  );
};

export default VerifyEmailPage;
