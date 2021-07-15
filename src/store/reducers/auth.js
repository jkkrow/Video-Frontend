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
    loginRequest: (state) => {
      state.loading = true;
    },

    loginSuccess: (state, { payload }) => {
      state.loading = false;
      state.token = payload.token;
      state.userData = payload.userData;
      state.error = null;
    },

    loginFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    logout: (state) => {
      state.token = null;
      state.userData = {};
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
