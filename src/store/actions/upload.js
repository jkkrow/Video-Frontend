import { uploadActions } from "store/reducers/upload";

export const initiateUpload = (nodeInfo) => {
  return (dispatch) => {
    dispatch(uploadActions.initiateUpload(nodeInfo));
  };
};

export const appendChild = (nodeInfo, location) => {
  return (dispatch) => {
    dispatch(
      uploadActions.appendChild({
        nodeInfo,
        location,
      })
    );
  };
};

export const updateNode = () => {
  return (dispatch) => {};
};
