import axios from "axios";

import { authActions } from "store/reducers/auth";

export const register = (name, email, password, confirmPassword, callback) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/register`,
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );

      dispatch(
        authActions.authSuccess({
          message: data.message,
        })
      );

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
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.userData,
        })
      );

      localStorage.setItem(
        "token",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      localStorage.setItem("userData", JSON.stringify(data.userData));
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
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.userData,
        })
      );

      localStorage.setItem(
        "token",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      localStorage.setItem("userData", JSON.stringify(data.userData));
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

    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };
};

export const updateRefreshToken = () => {
  return async (dispatch) => {
    // TODO: Implement update refreshToken
    // const { data } = await axios.post();
  };
};

export const clearResponse = () => {
  return (dispatch) => {
    dispatch(authActions.clearResponse());
  };
};

export const verifyEmail = (token, callback) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/auth/verify-email/${token}`
      );

      dispatch(
        authActions.authSuccess({
          message: data.message,
        })
      );

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

export const sendVerifyEmail = (email) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/send-verify-email`,
        { email }
      );

      dispatch(
        authActions.authSuccess({
          message: data.message,
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

export const sendRecoveryEmail = (email) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/send-recovery-email`,
        { email }
      );

      dispatch(
        authActions.authSuccess({
          message: data.message,
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

export const getResetPassword = (token) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/auth/reset-password/${token}`
      );

      dispatch(authActions.allowAccess());
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

export const postResetPassword = (password, confirmPassword, token) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/auth/reset-password/${token}`,
        { password, confirmPassword }
      );

      dispatch(
        authActions.authSuccess({
          message: data.message,
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

export const updateUserData = (info) => {
  return (dispatch) => {
    dispatch(
      authActions.updateUserData({
        info,
      })
    );

    const prevUserData = JSON.parse(localStorage.getItem("userData"));

    const newUserData = {
      ...prevUserData,
      ...info,
    };

    localStorage.setItem("userData", JSON.stringify(newUserData));
  };
};
