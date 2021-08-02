import { createSlice } from "@reduxjs/toolkit";
import { v1 as uuidv1 } from "uuid";

import { findNode } from "util/tree";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    uploadTree: {},
    previewTree: {},
  },
  reducers: {
    initiateUpload: (state) => {
      const newId = uuidv1();

      state.uploadTree = {
        root: {
          id: newId,
          layer: 0,
          info: null,
          children: [],
        },
      };

      state.previewTree = {
        root: {
          id: newId,
          layer: 0,
          info: null,
          children: [],
        },
      };
    },

    appendChild: (state, { payload }) => {
      const uploadNode = findNode(state.uploadTree, payload.nodeId);
      const previewNode = findNode(state.previewTree, payload.nodeId);

      const newNode = {
        id: uuidv1(),
        layer: uploadNode.layer + 1,
        info: null,
        children: [],
      };

      uploadNode.children.push(newNode);
      previewNode.children.push(newNode);
    },

    setPreviewNode: (state, { payload }) => {
      const previewNode = findNode(state.previewTree, payload.nodeId);

      previewNode.info = payload.info;
    },

    setUploadNode: (state, { payload }) => {
      const uploadNode = findNode(state.uploadTree, payload.nodeId);

      uploadNode.info = payload.info;
    },

    setUploadProgress: (state, { payload }) => {
      const uploadNode = findNode(state.uploadTree, payload.nodeId);

      uploadNode.info.progress = payload.progress;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
