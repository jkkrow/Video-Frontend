import { createContext, useState } from "react";

export const VideoContext = createContext({
  activeVideo: {},
  updateActiveVideo: () => {},
});

const VideoContextProvider = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState({
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd",
    children: [
      {
        src: "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8",
        children: [],
      },
    ],
  });

  const updateActiveVideo = (title) => {
    setActiveVideo((prev) =>
      prev.children.find((video) => video.info.optionTitle === title)
    );
  };

  return (
    <VideoContext.Provider value={{ activeVideo, updateActiveVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
