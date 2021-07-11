import { useState, useContext } from "react";
import axios from "axios";

import Loader from "components/UI/Loader/LoadingSpinner";
import { AuthContext } from "context/auth-context";
import GoogleLoginButton from "components/Auth/GoogleLoginButton";
import "./LoginPage.css";

const LoginPage = () => {
  const { loginHandler } = useContext(AuthContext);

  const [loadingStatus, setLoadingStatus] = useState(false);

  const googleLoginHandler = async (googleData) => {
    setLoadingStatus(true);

    const { data } = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/auth/google-login`,
      { tokenId: googleData.tokenId }
    );

    setLoadingStatus(false);
    loginHandler(data.token, data.userData);
  };

  return (
    <div className="login-page">
      <Loader display={loadingStatus} />
      <GoogleLoginButton onLogin={googleLoginHandler} />
    </div>
  );
};

export default LoginPage;
