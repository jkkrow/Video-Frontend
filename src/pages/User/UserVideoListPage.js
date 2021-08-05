import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Modal from "components/UI/Modal";
// import LoadingSpinner from "components/UI/Loader/LoadingSpinner";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import Input from "components/FormElement/Input";
import Button from "components/FormElement/Button";
import { initiateUpload } from "store/actions/upload";
import { useForm } from "hooks/form-hook";
import { VALIDATOR_EQUAL } from "util/validators";
import "./UserVideoListPage.css";

const ITEMS = [
  {
    _id: Math.random(),
    title: "test_video_1",
    views: 412341,
    createdAt: new Date().toISOString().substr(0, 10),
  },

  {
    _id: Math.random(),
    title: "test_video_2",
    views: 245341,
    createdAt: new Date().toISOString().substr(0, 10),
  },

  {
    _id: Math.random(),
    title: "test_video_3",
    views: 65443,
    createdAt: new Date().toISOString().substr(0, 10),
  },

  {
    _id: Math.random(),
    title: "test_video_4",
    views: 2324,
    createdAt: new Date().toISOString().substr(0, 10),
  },

  {
    _id: Math.random(),
    title: "test_video_5",
    views: 867,
    createdAt: new Date().toISOString().substr(0, 10),
  },

  {
    _id: Math.random(),
    title: "test_video_6",
    views: 23983,
    createdAt: new Date().toISOString().substr(0, 10),
  },
  {
    _id: Math.random(),
    title: "test_video_7",
    views: 6564,
    createdAt: new Date().toISOString().substr(0, 10),
  },

  {
    _id: Math.random(),
    title: "test_video_8",
    views: 99904351,
    createdAt: new Date().toISOString().substr(0, 10),
  },
];

const UserVideoListPage = ({ history }) => {
  const dispatch = useDispatch();
  const { uploadTree } = useSelector((state) => state.upload);
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState({});
  const { formState, setFormInput } = useForm({
    video: { value: "", isValid: false },
  });

  const addNewVideoHandler = () => {
    // Create new Upload Tree in redux
    if (!uploadTree.root) {
      dispatch(initiateUpload());
    }

    history.push("/new-video");
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
        onClose={closeWarningHandler}
      />

      <div className="user-video-list__header">
        <Button onClick={addNewVideoHandler}>
          <PlusIcon />
          NEW VIDEO
        </Button>
      </div>
      {ITEMS.length > 0 && (
        <div className="user-video-list__table__container">
          <table className="user-video-list__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Views</th>
                <th>Uploaded Date</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item) => (
                <tr key={item._id}>
                  <td data-label="ID">{item._id}</td>
                  <td data-label="Title">{item.title}</td>
                  <td data-label="Views">{item.views}</td>
                  <td data-label="Uploaded Date">{item.createdAt}</td>
                  <td>
                    <Button inversed onClick={() => openWarningHandler(item)}>
                      DELETE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserVideoListPage;
