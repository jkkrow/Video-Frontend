import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    videoTree: {},
    activeId: "",
    videoVolume: 1,
  },
  reducers: {
    setVideoTree: (state, { payload }) => {
      state.videoTree = payload.videoTree;
    },

    updateActiveVideo: (state, { payload }) => {
      state.activeId = payload.activeId;
    },

    updateVideoVolume: (state, { payload }) => {
      state.videoVolume = payload.videoVolume;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
