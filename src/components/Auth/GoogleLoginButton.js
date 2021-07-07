import { GoogleLogin } from "react-google-login";
import "./GoogleLoginButton.css";

const GoogleLoginButton = ({ onLogin }) => {
  const errorHandler = (err) => {
    console.log(err);
  };

  return (
    <div className="google-login-button">
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Sign in with Google"
        prompt="select_account"
        cookiePolicy={"single_host_origin"}
        onSuccess={onLogin}
        onFailure={errorHandler}
      />
    </div>
  );
};

export default GoogleLoginButton;
