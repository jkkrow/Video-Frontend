import { videoActions } from "store/reducers/video";

export const setVideoTree = (tree) => {
  return (dispatch) => {
    dispatch(
      videoActions.setVideoTree({
        videoTree: tree,
      })
    );
  };
};

export const updateActiveVideo = (id) => {
  return (dispatch) => {
    dispatch(
      videoActions.updateActiveVideo({
        activeId: id,
      })
    );
  };
};

export const updateVideoVolume = (volume) => {
  return (dispatch) => {
    dispatch(
      videoActions.updateVideoVolume({
        videoVolume: volume,
      })
    );
  };
};
