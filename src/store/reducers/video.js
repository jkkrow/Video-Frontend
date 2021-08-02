import { createSlice } from "@reduxjs/toolkit";

import { findById } from "util/tree";

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

    selectNextVideo: (state, { payload }) => {
      const videoNode = findById(state.videoTree, payload.currentId);

      const selectedVideo = videoNode.children.filter(
        (item) => item.id === payload.nextId
      );

      videoNode.children = selectedVideo;
    },

    updateVideoVolume: (state, { payload }) => {
      state.videoVolume = payload.videoVolume;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
