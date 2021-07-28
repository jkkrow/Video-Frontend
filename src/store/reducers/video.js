import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    videoTree: {},
    activeVideo: null,
    videoVolume: 1,
  },
  reducers: {
    setVideoTree: (state, { payload }) => {
      state.videoTree = payload.videoTree;
    },

    updateActiveVideo: (state, { payload }) => {
      state.activeVideo = payload.activeVideo;
    },

    updateVideoVolume: (state, { payload }) => {
      state.videoVolume = payload.videoVolume;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
