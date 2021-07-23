import { useState } from "react";

import Modal from "components/UI/Modal";
// import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import IconButton from "components/UI/IconButton";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import { useForm } from "hooks/form-hook";
import { VALIDATOR_EQUAL } from "util/validators";
import "./UserVideoListPage.css";

const ITEMS = [
  { _id: Math.random(), title: "test_video_1", views: 412341 },

  { _id: Math.random(), title: "test_video_2", views: 245341 },

  { _id: Math.random(), title: "test_video_3", views: 65443 },

  { _id: Math.random(), title: "test_video_4", views: 2324 },

  { _id: Math.random(), title: "test_video_5", views: 867 },

  { _id: Math.random(), title: "test_video_6", views: 23983 },
  { _id: Math.random(), title: "test_video_7", views: 6564 },

  { _id: Math.random(), title: "test_video_8", views: 99904351 },
  { _id: Math.random(), title: "test_video_9", views: 456456 },

  { _id: Math.random(), title: "test_video_10", views: 24756785341 },

  { _id: Math.random(), title: "test_video_11", views: 654476573 },

  { _id: Math.random(), title: "test_video_12", views: 89798 },

  { _id: Math.random(), title: "test_video_13", views: 225235 },

  { _id: Math.random(), title: "test_video_14", views: 324 },
  { _id: Math.random(), title: "test_video_15", views: 34521 },

  { _id: Math.random(), title: "test_video_16", views: 53453 },
];

const UserVideoListPage = ({ history }) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState({});
  const { formState, setFormInput } = useForm({
    video: { value: "", isValid: false },
  });

  const addNewVideoHandler = () => {
    // Create new Upload Tree in redux

    history.push("/upload");
  };

  const openWarningHandler = (item) => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
    setTargetItem({});
  };

  const deleteHandler = () => {
    console.log("DELETE");
  };

  return (
    <div className="user-video-list-page">
      <Modal
        on={displayModal}
        header="Delete Video"
        content={
          <>
            <p>
              To proceed type the video name <strong>{targetItem.title}</strong>
              .
            </p>
            <Input
              id="video"
              type="text"
              formElement
              validators={[VALIDATOR_EQUAL(targetItem.title)]}
              onForm={setFormInput}
            />
          </>
        }
        footer="Delete"
        loading={false}
        disabled={!formState.isValid}
        onConfirm={deleteHandler}
        onCancel={closeWarningHandler}
      />
      <div className="user-video-list__header">
        <Button onClick={addNewVideoHandler}>
          <PlusIcon />
          NEW VIDEO
        </Button>
      </div>
      {ITEMS.length > 0 && (
        <table className="user-video-list__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Views</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((video) => (
              <tr key={video._id}>
                <td>{video._id}</td>
                <td>{video.title}</td>
                <td>{video.views}</td>
                <td>
                  <IconButton
                    type="remove"
                    onClick={() => openWarningHandler(video)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserVideoListPage;
