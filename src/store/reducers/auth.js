import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token")).accessToken
      : {},
    refreshToken: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token")).refreshToken
      : {},
    userData: localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null,
    loading: false,
    error: null,
    message: null,
    access: null,
  },
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, { payload }) => {
      state.loading = false;
      state.message = payload.message;
    },

    authFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
    },

    login: (state, { payload }) => {
      state.loading = false;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.userData = payload.userData;
    },

    logout: (state) => {
      state.accessToken = {};
      state.refreshToken = {};
      state.userData = null;
    },

    updateUserData: (state, { payload }) => {
      state.userData = {
        ...state.userData,
        ...payload.info,
      };
    },

    allowAccess: (state) => {
      state.loading = false;
      state.access = true;
    },

    clearResponse: (state) => {
      state.error = null;
      state.message = null;
      state.access = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
