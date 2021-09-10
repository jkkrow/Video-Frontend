import axios from "axios";

import { authActions } from "store/reducers/auth";

export const register = (name, email, password, confirmPassword, callback) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });

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

      const { data } = await axios.post("/auth/login", { email, password });

      dispatch(
        authActions.login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.userData,
        })
      );

      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
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

      const { data } = await axios.post("/auth/google-login", {
        tokenId: googleData.tokenId,
      });

      dispatch(
        authActions.login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.userData,
        })
      );

      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
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

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  };
};

export const updateRefreshToken = (token) => {
  let success = false;
  let retry = 0;

  return async (dispatch) => {
    while (!success && retry <= 3) {
      try {
        const { data } = await axios.get("/auth/update-refresh-token", {
          headers: { Authorization: "Bearer " + token },
        });

        dispatch(
          authActions.updateRefreshToken({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );

        localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

        success = true;
      } catch (err) {
        console.log(err);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        retry++;
      }
    }
  };
};

export const updateAccessToken = (token) => {
  let success = false;
  let retry = 0;

  return async (dispatch) => {
    while (!success && retry <= 3) {
      try {
        const { data } = await axios.get("/auth/update-access-token", {
          headers: { Authorization: "Bearer " + token },
        });

        dispatch(
          authActions.updateAccessToken({
            accessToken: data.accessToken,
          })
        );

        success = true;
      } catch (err) {
        console.log(err);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        retry++;
      }
    }
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

      const { data } = await axios.get(`/auth/verify-email/${token}`);

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

      const { data } = await axios.post("/auth/send-verify-email", { email });

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

      const { data } = await axios.post("/auth/send-recovery-email", { email });

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

      await axios.get(`/auth/reset-password/${token}`);

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

      const { data } = await axios.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

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
