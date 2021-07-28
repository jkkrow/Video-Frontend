import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import VideoGroup from "./VideoGroup";
import { setVideoTree, updateActiveVideo } from "store/actions/video";
import "./VideoTree.css";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const dispatch = useDispatch();
  const { activeVideo } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(setVideoTree(tree));
    dispatch(updateActiveVideo(tree.root));
  }, [dispatch, tree]);

  return (
    <div className="video-tree">
      {activeVideo && (
        <VideoGroup
          currentVideo={tree.root}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default VideoTree;
