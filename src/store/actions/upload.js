import axios from "axios";

import { uploadActions } from "store/reducers/upload";

export const initiateUpload = () => {
  return (dispatch) => {
    dispatch(uploadActions.initiateUpload());
  };
};

export const appendChild = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.appendChild({
        nodeId,
      })
    );
  };
};

export const attachVideo = (file, nodeId, treeId, accessToken) => {
  return async (dispatch) => {
    try {
      dispatch(
        uploadActions.setUploadNode({
          info: {
            name: file.name,
            label: "DEFAULT",
            timelineStart: null,
            timelineEnd: null,
          },
          nodeId,
        })
      );

      dispatch(
        uploadActions.setPreviewNode({
          info: {
            name: file.name,
            label: "DEFAULT",
            timelineStart: null,
            timelineEnd: null,
            url: URL.createObjectURL(file),
          },
          nodeId,
        })
      );

      const params = {
        videoTitle: treeId,
        fileName: file.name,
        fileType: file.type,
      };

      const response = await axios.get("/upload/initiate-upload", {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { uploadId } = response.data;

      dispatch(
        uploadActions.setUploadNode({
          info: {
            uploadId,
          },
          nodeId,
        })
      );

      const fileSize = file.size;
      const CHUNK_SIZE = 10000000; // 10MB
      const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
      const promisesArray = [];
      const progressArray = [];

      let start, end, blob;

      const uploadProgressHandler = async (progressEvent, index) => {
        if (progressEvent.loaded >= progressEvent.total) return;

        const currentProgress =
          Math.round(progressEvent.loaded * 100) / progressEvent.total;

        progressArray[index - 1] = currentProgress;
        const sum = progressArray.reduce((acc, cur) => acc + cur);

        dispatch(
          uploadActions.setUploadNode({
            info: {
              progress: `${Math.round(sum / CHUNKS_COUNT)}%`,
            },
            nodeId,
          })
        );
      };

      for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
        start = (index - 1) * CHUNK_SIZE;
        end = index * CHUNK_SIZE;
        blob =
          index < CHUNKS_COUNT ? file.slice(start, end) : file.slice(start);

        // Initiate Upload
        const getUploadUrlResponse = await axios.get("/upload/get-upload-url", {
          params: {
            videoTitle: treeId,
            fileName: file.name,
            partNumber: index,
            uploadId,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { presignedUrl } = getUploadUrlResponse.data;

        // Upload Parts
        const uploadResponse = axios.put(presignedUrl, blob, {
          onUploadProgress: (e) => uploadProgressHandler(e, index),
          headers: {
            "Content-Type": file.type,
          },
        });
        promisesArray.push(uploadResponse);
      }

      const resolvedArray = await Promise.all(promisesArray);

      const uploadPartsArray = [];
      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag,
          PartNumber: index + 1,
        });
      });

      // Complete Upload
      await axios.post(
        "/upload/complete-upload",
        {
          params: {
            videoTitle: treeId,
            fileName: file.name,
            parts: uploadPartsArray,
            uploadId,
          },
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      dispatch(
        uploadActions.setUploadNode({
          info: { progress: "100%" },
          nodeId,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateActiveNode = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.updateActiveNode({
        nodeId,
      })
    );
  };
};

export const updateNode = (info, nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.setUploadNode({
        info,
        nodeId,
      })
    );

    dispatch(
      uploadActions.setPreviewNode({
        info,
        nodeId,
      })
    );
  };
};

export const removeNode = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.removeNode({
        nodeId,
      })
    );
  };
};

export const removeTree = () => {
  return (dispatch) => {
    dispatch(uploadActions.removeTree());
  };
};
