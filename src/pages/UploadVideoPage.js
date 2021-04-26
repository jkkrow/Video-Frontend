// import FileUploader from "components/Upload/FileUploader";
import FileTree from "components/Upload/FileTree";
import "./UploadVideoPage.css";

const UploadVideoPage = () => {
  return (
    <div className="upload-video-page">
      <div className="upload-file">
        <FileTree />
        {/* <FileUploader /> */}
      </div>
    </div>
  );
};

export default UploadVideoPage;
