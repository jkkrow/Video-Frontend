import axios from "axios";

import { authActions } from "store/reducers/auth";

export const register = (name, email, password) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.registerRequest());

      await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
        name,
        email,
        password,
      });

      dispatch(authActions.registerSuccess());
    } catch (err) {
      dispatch(
        authActions.registerFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.loginRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        { email, password }
      );

      dispatch(
        authActions.loginSuccess({
          token: data.token,
          userData: data.userData,
        })
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          userData: data.userData,
        })
      );
    } catch (err) {
      dispatch(
        authActions.loginFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const googleLogin = (googleData) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.loginRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/google-login`,
        { tokenId: googleData.tokenId }
      );

      dispatch(
        authActions.loginSuccess({
          token: data.token,
          userData: data.userData,
        })
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          userData: data.userData,
        })
      );
    } catch (err) {
      dispatch(
        authActions.loginFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
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

export const clearError = () => {
  return (dispatch) => {
    dispatch(authActions.clearError());
  };
};
