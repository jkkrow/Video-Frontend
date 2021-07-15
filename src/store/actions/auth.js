import axios from "axios";

import { authActions } from "store/reducers/auth";

export const googleLogin = (googleData) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.loginRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/google-login`,
        { tokenId: googleData.tokenId }
      );

      const user = {
        token: data.token,
        userData: data.userData,
      };

      dispatch(authActions.loginSuccess(user));

      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      dispatch(
        authActions.loginFail(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        )
      );
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("user");
  };
};
