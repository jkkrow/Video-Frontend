import axios from "axios";

import { authActions } from "store/reducers/auth";

export const register = (name, email, password, confirmPassword, callback) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      dispatch(authActions.register());

      callback();
    } catch (err) {
      dispatch(
        authActions.authFail({
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
      dispatch(authActions.authRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        { email, password }
      );

      dispatch(
        authActions.login({
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
        authActions.authFail({
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
      dispatch(authActions.authRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/google-login`,
        { tokenId: googleData.tokenId }
      );

      dispatch(
        authActions.login({
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
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const googleLoginError = (err) => {
  return (dispatch) => {
    dispatch(
      authActions.authFail({
        error: err.details || err.message || null,
      })
    );
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
