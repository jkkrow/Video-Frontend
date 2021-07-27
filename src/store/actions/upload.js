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

export const attachVideo = (file, nodeId) => {
  return (dispatch) => {
    console.log(file);
    dispatch(
      uploadActions.attachVideo({
        info: {
          name: file.name,
          label: "",
        },
        previewUrl: URL.createObjectURL(file),
        nodeId,
      })
    );
  };
};

export const updateNode = () => {
  return (dispatch) => {};
};
