import VideoPlayer from "./components/VideoPlayer";
import ExampleVid from "./assets/videos/vid_1_720p.mp4";
import "./App.css";

function App() {  
  return (
    <div className="App">
      <VideoPlayer src={ExampleVid} />
    </div>
  );
}

export default App;
