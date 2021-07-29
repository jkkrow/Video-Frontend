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

export const updateActiveVideo = (video) => {
  return (dispatch) => {
    dispatch(
      videoActions.updateActiveVideo({
        activeVideo: video,
      })
    );
  };
};

export const selectNextVideo = (currentId, nextId) => {
  return (dispatch) => {
    dispatch(
      videoActions.selectNextVideo({
        currentId,
        nextId,
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
