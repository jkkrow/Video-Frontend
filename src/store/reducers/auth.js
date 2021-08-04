import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).token
      : null,
    userData: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).userData
      : {},
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
      state.token = payload.token;
      state.userData = payload.userData;
    },

    logout: (state) => {
      state.token = null;
      state.userData = {};
    },

    updateUserData: (state, { payload }) => {
      for (const prop in payload.diff) {
        state.userData[prop] = payload.diff[prop];
      }
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
