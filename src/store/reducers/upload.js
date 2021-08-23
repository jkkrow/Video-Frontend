import { createSlice } from "@reduxjs/toolkit";
import { v1 as uuidv1 } from "uuid";

import { findById, findByChildId } from "util/tree";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    uploadTree: {},
    previewTree: {},
  },
  reducers: {
    initiateUpload: (state) => {
      const newNode = {
        id: uuidv1(),
        layer: 0,
        info: null,
        children: [],
      };

      state.uploadTree.root = newNode;
      state.previewTree.root = newNode;
    },

    appendChild: (state, { payload }) => {
      const uploadNode = findById(state.uploadTree, payload.nodeId);
      const previewNode = findById(state.previewTree, payload.nodeId);

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
      const previewNode = findById(state.previewTree, payload.nodeId);

      if (!previewNode.info) {
        previewNode.info = payload.info;
      } else {
        previewNode.info = {
          ...previewNode.info,
          ...payload.info,
        };
      }
    },

    setUploadNode: (state, { payload }) => {
      const uploadNode = findById(state.uploadTree, payload.nodeId);

      if (!uploadNode.info) {
        uploadNode.info = payload.info;
      } else {
        uploadNode.info = {
          ...uploadNode.info,
          ...payload.info,
        };
      }
    },

    removeNode: (state, { payload }) => {
      const uploadNode = findByChildId(state.uploadTree, payload.nodeId);

      uploadNode.children = uploadNode.children.filter(
        (item) => item.id !== payload.nodeId
      );
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
