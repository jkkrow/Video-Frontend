import VideoGroup from "./VideoGroup";
import VideoContextProvider from "context/video-context";
import "./VideoTree.css";

const VideoTree = () => {
  return (
    <VideoContextProvider>
      <div className="video-tree">
        <VideoGroup
          src="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
          next={[
            {
              src: "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8",
              children: [],
            },
          ]}
          autoPlay={true}
          selected={true}
        />
      </div>
    </VideoContextProvider>
  );
};

export default VideoTree;
