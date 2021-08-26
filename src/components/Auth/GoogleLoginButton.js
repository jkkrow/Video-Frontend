import { GoogleLogin } from "react-google-login";

import { ReactComponent as GoogleIcon } from "assets/icons/google.svg";
import Button from "components/FormElement/Button";
import "./GoogleLoginButton.css";

const GoogleLoginButton = ({ onLoginSuccess, onLoginFail, loading }) => {
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      prompt="select_account"
      cookiePolicy={"single_host_origin"}
      onSuccess={onLoginSuccess}
      onFailure={onLoginFail}
      render={(renderProps) => (
        <Button
          className="google-login-button"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled || loading}
          loading={renderProps.disabled}
        >
          <GoogleIcon />
          <p>GOOGLE SIGN IN</p>
        </Button>
      )}
    />
  );
};

export default GoogleLoginButton;
