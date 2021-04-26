import { useState, useRef } from "react";

import { ReactComponent as Plus } from "assets/icons/plus.svg";
import "./FileUploader.css";

const FileUploader = ({ from }) => {
  const [file, setFile] = useState(null);
  const [children, setChildren] = useState([]);
  const fileUploaderRef = useRef();

  const openFileInputHandler = () => fileUploaderRef.current.click();

  const fileChangeHandler = async (event) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];

    // Add part to state
    setPart(file.name);

    // Add to entire upload state
    appendNext(file.name, from);

    // Read file to show preview
    // setSource(URL.createObjectURL(file));

    // Upload file to AWS S3
    // const uploadConfig = await axios.get(
    //   `${process.env.REACT_APP_SERVER_URL}/upload`
    // );

    // await axios.put(uploadConfig.data.url, file, {
    //   headers: { "Content-Type": file.type },
    //   onUploadProgress: (progressEvent) => {
    //     console.log(progressEvent);
    //   },
    // });
  };

  return (
    <div className="file-uploader">
      <div className="file-uploader__header">
        <input
          ref={fileUploaderRef}
          hidden
          type="file"
          accept=".mp4"
          onChange={fileChangeHandler}
        />
        <div className="file-uploader_title" onClick={openFileInputHandler}>
          {!part ? "Add File" : part}
        </div>
      </div>
      <div className="file-uploader__children">
        {children.length > 0 &&
          children.map((item) => {
            <FileUploader key={item.file.lastModified} from={part} />;
          })}
      </div>
    </div>
  );
};

export default FileUploader;
