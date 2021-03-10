import Video from "./videos/components/Video";
import ExampleVid from "./assets/videos/vid_1_720p.mp4";
import "./App.css";

// import VideoPlayer from "./videos/components/VideoPlayer";

function App() {
  // const videoJsOptions = {
  //   autoplay: true,
  //   controls: true,
  //   sources: [
  //     {
  //       src: ExampleVid,
  //       type: "video/mp4",
  //     },
  //   ],
  // };

  return (
    <div className="App">
      <Video src={ExampleVid} />
      {/* <VideoPlayer {...videoJsOptions} /> */}\
    </div>
  );
}

export default App;
