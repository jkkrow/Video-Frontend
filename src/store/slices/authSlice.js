import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    userData: {},
    loading: false,
    error: null,
  },
  reducers: {
    signinRequest: (state) => {
      state.loading = true;
    },

    signinSuccess: (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    },

    signinFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
