import FileUploader from "components/Upload/FileUploader";
import "./UploadVideoPage.css";

const UploadVideoPage = () => {
  return (
    <div className="upload-video-page">
      <div className="upload-file">
        <FileUploader />
      </div>
    </div>
  );
};

export default UploadVideoPage;
