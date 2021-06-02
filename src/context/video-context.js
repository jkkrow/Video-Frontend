import { createContext, useState } from "react";

export const VideoContext = createContext({
  currentVideo: {},
  updateVideo: () => {},
});

const VideoContextProvider = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState({
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd",
  });

  const updateVideo = (newVideo) => {
    setCurrentVideo(newVideo);
  };

  return (
    <VideoContext.Provider value={{ currentVideo, updateVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
