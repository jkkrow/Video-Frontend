import { useSelector } from "react-redux";

import UploadTree from "components/Upload/TreeView/Tree/UploadTree";
import Preview from "components/Upload/Preview/Preview";
import "./UploadVideoPage.css";

const UploadVideoPage = () => {
  const { uploadTree, previewTree } = useSelector((state) => state.upload);

  return (
    <div className="upload-video-page">
      {uploadTree.root && <UploadTree tree={uploadTree} />}
      {previewTree.root?.info && <Preview tree={previewTree} />}
    </div>
  );
};

export default UploadVideoPage;
