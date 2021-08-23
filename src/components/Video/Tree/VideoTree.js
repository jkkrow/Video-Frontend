import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import VideoNode from "./VideoNode";
import { setVideoTree, updateActiveVideo } from "store/actions/video";
import "./VideoTree.css";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const dispatch = useDispatch();
  const { videoTree, activeVideo } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(setVideoTree(tree));
    dispatch(updateActiveVideo(tree.root));

    return () => {
      dispatch(setVideoTree({}));
      dispatch(updateActiveVideo(null));
    };
  }, [dispatch, tree]);

  return (
    <div className="video-tree">
      {videoTree && activeVideo && (
        <VideoNode
          currentVideo={videoTree.root}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default VideoTree;
