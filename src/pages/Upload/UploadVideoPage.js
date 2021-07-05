import FileTree from "components/Upload/TreeView/Tree/FileTree";
import Preview from "components/Upload/Preview/Preview";
import "./UploadVideoPage.css";

const UploadVideoPage = () => {
  return (
    <div className="upload-video-page">
      <FileTree />
      <Preview />
    </div>
  );
};

export default UploadVideoPage;
