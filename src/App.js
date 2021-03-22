import VideoPlayer from "./components/VideoPlayer";
// import ExampleVid from "./assets/videos/vid_1_720p.mp4";
// import VJSPlayer from "./components/VJSPlayer";

import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <VideoPlayer src={ExampleVid} /> */}
      <VideoPlayer src="https://vjs.zencdn.net/v/oceans.mp4" />
      {/* <VJSPlayer src={ExampleVid} /> */}
      {/* <VJSPlayer
        src={{
          type: "video/youtube",
          src:
            "https://youtu.be/b9RJXWxth5g?list=RDGMEM_v2KDBP3d4f8uT-ilrs8fQVMb9RJXWxth5g",
        }}
      /> */}
    </div>
  );
}

export default App;
