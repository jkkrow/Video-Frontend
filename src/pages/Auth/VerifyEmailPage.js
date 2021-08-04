import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import Response from "components/FormElement/Response";
import { verifyEmail, updateUserData, clearResponse } from "store/actions/auth";
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const dispatch = useDispatch();

  const { token, loading, error, message } = useSelector((state) => state.auth);

  const param = useParams().token;

  useEffect(() => {
    const updateUserVerfied = () => {
      if (!token) return;

      dispatch(updateUserData({ isVerified: true }));
    };

    dispatch(verifyEmail(param, updateUserVerfied));

    return () => dispatch(clearResponse());
  }, [dispatch, token, param]);

  return (
    <div className="verify-email-page">
      <LoadingSpinner on={loading} />
      <Response type={error ? "error" : "message"} content={error || message} />
    </div>
  );
};

export default VerifyEmailPage;
