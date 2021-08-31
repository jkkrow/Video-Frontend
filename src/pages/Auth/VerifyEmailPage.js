import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import Response from "components/FormElement/Response";
import { verifyEmail, updateUserData, clearResponse } from "store/actions/auth";
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const dispatch = useDispatch();

  const { userData, loading, error, message } = useSelector(
    (state) => state.auth
  );

  const { token } = useParams();

  useEffect(() => {
    const updateUserVerfied = () => {
      if (!userData) return;

      dispatch(updateUserData({ isVerified: true }));
    };

    dispatch(verifyEmail(token, updateUserVerfied));

    return () => dispatch(clearResponse());
  }, [dispatch, userData, token]);

  return (
    <div className="auth-page">
      <LoadingSpinner on={loading} />
      <Response type={error ? "error" : "message"} content={error || message} />
    </div>
  );
};

export default VerifyEmailPage;
