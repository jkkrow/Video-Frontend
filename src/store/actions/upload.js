import { uploadActions } from "store/reducers/upload";

export const initiateUpload = () => {
  return (dispatch) => {
    dispatch(uploadActions.initiateUpload());
  };
};

export const appendChild = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.appendChild({
        nodeId,
      })
    );
  };
};

export const updateNode = () => {
  return (dispatch) => {};
};
