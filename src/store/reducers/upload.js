import { v1 as uuidv1 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import { findNode } from "util/tree";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    videoTree: {},
  },
  reducers: {
    initiateUpload: (state, { payload }) => {
      state.videoTree = {
        root: {
          id: uuidv1(),
          info: payload,
          children: [],
        },
      };
      console.log(state);
    },

    appendChild: (state, { payload }) => {
      const targetNode = findNode(state.videoTree, payload.location);

      if (!targetNode) return;

      const newNode = {
        id: uuidv1(),
        info: payload.nodeInfo,
        children: [],
      };

      targetNode.children.push(newNode);
    },

    updateNode: () => {},
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
