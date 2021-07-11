import { useState } from "react";

// import VideoTree from "components/Video/VideoTree";
import LoadingCard from "components/UI/Loader/LoadingCard";
import "./VideoListPage.css";

const ITEMS = [1, 1, 1, 1];

const VideoListPage = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);

  return (
    <div className="video-list-page">
      {ITEMS.map((item, index) => (
        <div key={index} className="video-item">
          <LoadingCard
            display={loadingStatus}
            onClick={() => setLoadingStatus(false)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoListPage;
