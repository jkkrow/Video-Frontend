import { v1 as uuidv1 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import { findNode } from "util/tree";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    uploadTree: {},
    previewTree: {},
  },
  reducers: {
    initiateUpload: (state) => {
      state.uploadTree = {
        root: {
          id: uuidv1(),
          info: null,
          children: [],
        },
      };
    },

    appendChild: (state, { payload }) => {
      const targetNode = findNode(state.uploadTree, payload.nodeId);

      if (!targetNode) return;

      const newNode = {
        id: uuidv1(),
        info: null,
        children: [],
      };

      targetNode.children.push(newNode);
    },

    updateNode: (state, { payload }) => {
      const targetNode = findNode(state.uploadTree, payload.nodeId);

      if (!targetNode) return;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
