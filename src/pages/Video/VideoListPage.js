import { useState } from "react";

// import VideoTree from "components/Video/VideoTree";
import LoadingCard from "components/UI/Loader/LoadingCard";
import "./VideoListPage.css";

const ITEMS = [1, 1, 1, 1, 1, 1, 1, 1];

const VideoListPage = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);

  return (
    <div className="video-list-page">
      <div className="video-carousel">
        <LoadingCard on={loadingStatus} />
      </div>
      <div className="video-list">
        {ITEMS.map((item, index) => (
          <div key={index} className="video-item">
            <LoadingCard
              on={loadingStatus}
              detail
              onClick={() => setLoadingStatus(false)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoListPage;
