import React, { useState } from "react";
import axios from "axios";

import "./UploadVideoPage.css";

const UploadVideoPage = (props) => {
  const [file, setFile] = useState();

  const onFileChangeHandler = (event) => {
    setFile(event.target.files[0]);
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
    </div>
  );
};

export default UploadVideoPage;
