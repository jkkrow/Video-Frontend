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

export const updateVideoVolume = (volume) => {
  return (dispatch) => {
    dispatch(
      videoActions.updateVideoVolume({
        videoVolume: volume,
      })
    );
  };
};
