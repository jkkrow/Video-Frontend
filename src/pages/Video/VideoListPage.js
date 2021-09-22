import { useEffect, useRef, useState } from "react";

import LoadingCard from "components/UI/Loader/LoadingCard";
import "./VideoListPage.css";

const VideoListPage = () => {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loaderNumber, setLoaderNumber] = useState([1]);

  const listRef = useRef();
  const itemRef = useRef();

  useEffect(() => {
    const listWidth = listRef.current.offsetWidth;
    const itemWidth = itemRef.current.offsetWidth;

    let rows = Math.floor(listWidth / itemWidth);

    if (rows === 1) rows = 3;

    setLoaderNumber(Array.from(Array(rows * 3)));
  }, []);

  return (
    <div className="video-list-page">
      <div className="video-carousel">
        <LoadingCard on={loadingStatus} />
      </div>
      <div className="video-list" ref={listRef}>
        {loaderNumber.map((item, index) => (
          <div key={index} className="video-item" ref={itemRef}>
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
