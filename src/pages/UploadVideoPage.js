import React, { useState } from "react";
import axios from "axios";

import VideoPlayer from "../components/VideoPlayer";
import "./UploadVideoPage.css";

const UploadVideoPage = (props) => {
  const [file, setFile] = useState();
  const [source, setSource] = useState();

  const onFileChangeHandler = (event) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSource(e.target.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    axios.put("http://localhost:5000/api/upload/", file);
  };

  return (
    <div className="video-upload">
      <form onSubmit={onSubmitHandler}>
        <input type="file" accept=".mp4" onChange={onFileChangeHandler} />
      </form>
      {source && <VideoPlayer src={source} />}
    </div>
  );
};

export default UploadVideoPage;
