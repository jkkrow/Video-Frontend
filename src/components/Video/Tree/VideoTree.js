import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import VideoNode from "./VideoNode";
import { setVideoTree, updateActiveVideo } from "store/actions/video";
import "./VideoTree.css";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const dispatch = useDispatch();

  const { videoTree, activeVideo } = useSelector((state) => state.video);

  const rootVideo = useState(tree.root)[0];

  useEffect(() => {
    dispatch(setVideoTree(tree));
  }, [dispatch, tree]);

  useEffect(() => {
    dispatch(updateActiveVideo(rootVideo));
  }, [dispatch, rootVideo]);

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
