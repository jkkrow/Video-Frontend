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
  },
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    registerSuccess: (state) => {
      state.loading = false;
    },

    registerFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
    },

    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, { payload }) => {
      state.loading = false;
      state.token = payload.token;
      state.userData = payload.userData;
    },

    loginFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
    },

    logout: (state) => {
      state.token = null;
      state.userData = {};
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
