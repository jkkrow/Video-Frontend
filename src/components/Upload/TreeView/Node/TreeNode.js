import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import IconButton from "components/UI/IconButton";
import NewNode from "./NewNode";
import { appendChild } from "store/actions/upload";
import "./TreeNode.css";

const TreeNode = ({ currentNode }) => {
  const dispatch = useDispatch();
  const { uploadTree } = useSelector((state) => state.upload);

  const [children, setChildren] = useState([]);
  const [openChildren, setOpenChildren] = useState(false);
  const [addChild, setAddChild] = useState(false);
  const [childInput, setChildInput] = useState("");
  const [expandBody, setExpandBody] = useState(true);
  const [optionTitle, setOptionTitle] = useState(currentNode.optionTitle);

  const [uploadId, setUploadId] = useState("");
  const [uploadProgress, setUploadProgress] = useState("0%");
  const setProgressArray = useState([])[1];

  const fileUploaderRef = useRef();

  const displayChildrenHandler = () => {
    setOpenChildren((prev) => !prev);
  };

  const expandBodyHandler = () => {
    setExpandBody((prev) => !prev);
  };

  const addChildHandler = () => {
    setAddChild(true);
  };

  const inputChangeHandler = (event) => {
    setOptionTitle(event.target.value);
  };

  const openFileInputHandler = () => {
    fileUploaderRef.current.click();
  };

  const fileChangeHandler = (event) => {
    if (!event.target.files?.length) return;

    // Add to state
    const fileObject = {
      file: event.target.files[0],
      optionTitle: childInput,
      layer: currentNode.layer + 1,
    };

    setChildren((prev) => [...prev, fileObject]);

    // Add to entire tree
    const fileInfo = {
      name: event.target.files[0].name,
      optionTitle: childInput,
      layer: currentNode.layer + 1,
      src: URL.createObjectURL(event.target.files[0]),
    };

    dispatch(appendChild(fileInfo, currentNode));

    // Close new node
    setAddChild(false);

    // Open children nodes
    setOpenChildren(true);
  };

  const cancelFileUpload = async () => {
    const params = {
      videoTitle: uploadTree.root.info.name,
      fileName: currentNode.file.name,
      uploadId,
    };

    const response = await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}/upload/cancel-upload`,
      { params }
    );

    console.log(response.data);

    setUploadId("");
    setProgressArray([]);
    setUploadProgress("0%");
  };

  useEffect(() => {
    const MultipartUploadToS3 = async () => {
      const params = {
        videoTitle: uploadTree.root.info.name,
        fileName: currentNode.file.name,
        fileType: currentNode.file.type,
      };

      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/upload/initiate-upload`,
        { params }
      );

      const { uploadId } = response.data;

      setUploadId(uploadId);

      console.log(uploadId);
      try {
        const fileSize = currentNode.file.size;
        const CHUNK_SIZE = 10000000; // 10MB
        const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
        const promisesArray = [];

        let start, end, blob;

        for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
          start = (index - 1) * CHUNK_SIZE;
          end = index * CHUNK_SIZE;
          blob =
            index < CHUNKS_COUNT
              ? currentNode.file.slice(start, end)
              : currentNode.file.slice(start);

          // Get presigned URL for each part
          const getUploadUrlResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/upload/get-upload-url`,
            {
              params: {
                videoTitle: uploadTree.root.info.name,
                fileName: currentNode.file.name,
                partNumber: index,
                uploadId,
              },
            }
          );

          // Upload Progress Handler
          const uploadProgressHandler = async (progressEvent, blob, index) => {
            if (progressEvent.loaded >= progressEvent.total) return;

            const currentProgress =
              Math.round(progressEvent.loaded * 100) / progressEvent.total;

            console.log("CURRENT: " + currentProgress);

            setProgressArray((prevArray) => {
              prevArray[index - 1] = currentProgress;
              const sum = prevArray.reduce((acc, cur) => acc + cur);

              setUploadProgress(`${Math.round(sum / CHUNKS_COUNT)}%`);

              console.log("TOTAL: " + Math.round(sum / CHUNKS_COUNT));

              return prevArray;
            });
          };

          const { presignedUrl } = getUploadUrlResponse.data;
          console.log(
            `Presigned URL ${index}: ${presignedUrl} filetype ${currentNode.file.type}`
          );

          // Send part to AWS Server
          const uploadResponse = axios.put(presignedUrl, blob, {
            onUploadProgress: (e) =>
              uploadProgressHandler(e, CHUNKS_COUNT, index),
            headers: {
              "Content-Type": currentNode.file.type,
            },
          });
          promisesArray.push(uploadResponse);
        }

        const resolvedArray = await Promise.all(promisesArray);
        console.log(resolvedArray, " resolvedArray");

        const uploadPartsArray = [];
        resolvedArray.forEach((resolvedPromise, index) => {
          uploadPartsArray.push({
            ETag: resolvedPromise.headers.etag,
            PartNumber: index + 1,
          });
        });

        console.log(uploadPartsArray);

        // Complete Multipart Upload in backend server
        const completeUploadResponse = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/upload/complete-upload`,
          {
            params: {
              videoTitle: uploadTree.root.info.name,
              fileName: currentNode.file.name,
              parts: uploadPartsArray,
              uploadId,
            },
          }
        );

        setUploadProgress("100%");
        console.log(completeUploadResponse.data, " upload response complete");
      } catch (error) {
        console.log(error);
      }
    };
    MultipartUploadToS3();
  }, [currentNode.file, uploadTree.root, setProgressArray]);

  return (
    <div className="tree-node">
      <div className="tree-node__body">
        <div className="tree-node__header">
          <input
            ref={fileUploaderRef}
            hidden
            multiple
            type="file"
            accept=".mp4"
            onChange={fileChangeHandler}
          />

          {children.length > 0 && (
            <IconButton
              className={`right-angle${openChildren ? " rotated" : ""}`}
              onClick={displayChildrenHandler}
            />
          )}

          <div className="tree-node__title" onClick={expandBodyHandler}>
            {currentNode.file.name}
          </div>

          {children.length < 4 && (
            <IconButton
              className="plus"
              onClick={addChildHandler}
              dataTooltip="ADD VIDEO"
            />
          )}
        </div>

        <div className={`tree-node__expand${!expandBody ? " hide" : ""}`}>
          {currentNode.layer > 0 && (
            <input
              className="tree-node__option-title"
              type="text"
              placeholder="Option Title"
              value={optionTitle}
              onChange={inputChangeHandler}
            />
          )}

          <div className="tree-node__progress">
            {uploadProgress !== "100%" ? (
              <>
                <div className="tree-node__progress__bar">
                  <div className="tree-node__progress__bar--background" />
                  <div
                    className="tree-node__progress__bar--current"
                    style={{ width: uploadProgress }}
                  />
                </div>
                <div>{uploadProgress}</div>

                <div className="tree-node__progress--cancel">
                  <IconButton className="remove" onClick={cancelFileUpload} />
                </div>
              </>
            ) : (
              <div>Uploaded</div>
            )}
          </div>
        </div>
      </div>

      {addChild && (
        <NewNode
          onFile={openFileInputHandler}
          onInput={setChildInput}
          onRemove={setAddChild}
        />
      )}

      {children.length > 0 && (
        <div className={`tree-node__children${!openChildren ? " hide" : ""}`}>
          {children.map((item) => (
            <TreeNode
              key={`${item.layer}:${item.file.name}-${item.optionTitle}`}
              currentNode={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
