import VideoPlayer from "components/Video/VideoPlayer";
// import ExampleVid from "assets/videos/vid_1_720p.mp4";
import "./VideoPage.css";

const VideoPage = () => {
  return (
    <div className="video-page">
      <VideoPlayer src="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd" />
      {/* <VideoPlayer src="https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8" /> */}
    </div>
  );
};

export default VideoPage;
