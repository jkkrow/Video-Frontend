import Video from "components/Video/VideoTree";
// import ExampleVid from "assets/videos/vid_1_720p.mp4";
// "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8"
import "./VideoPage.css";

const VideoPage = () => {
  return (
    <div className="video-page">
      <Video />
    </div>
  );
};

export default VideoPage;
