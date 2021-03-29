import React, { useState } from "react";
import axios from "axios";

import VideoPlayer from "../components/VideoPlayer";
import "./UploadVideoPage.css";

const UploadVideoPage = (props) => {
  const [files, setFiles] = useState([]);
  const [sources, setSources] = useState([]);

  const onFileChangeHandler = (event) => {
    if (!event.target.files?.length) return;

    // Add files to state
    const targetFiles = [...files, ...event.target.files];
    const fileSet = new Set();
    const validFiles = targetFiles.filter((file) => {
      const duplicate = fileSet.has(file.name);
      fileSet.add(file.name);

      return !duplicate;
    });
    setFiles(validFiles);

    // Read files to show preview
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSources((prev) => [...new Set([...prev, e.target.result])]);
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    axios.put("http://localhost:5000/api/upload/", files);
  };

  return (
    <div className="video-upload">
      <form onSubmit={onSubmitHandler}>
        <input
          type="file"
          multiple
          accept=".mp4"
          onChange={onFileChangeHandler}
        />
      </form>
      <ul>
        {sources.length
          ? sources.map((src) => (
              <li>
                <VideoPlayer src={src} />
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default UploadVideoPage;
