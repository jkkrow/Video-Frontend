import { useDispatch, useSelector } from "react-redux";

import Button from "components/FormElement/Button";
import Avatar from "components/User/Avatar";
import Card from "components/UI/Card";
import Modal from "components/UI/Modal";
import { sendVerifyEmail, clearResponse } from "store/actions/auth";
import "./AccountPage.css";

const AccountPage = () => {
  const dispatch = useDispatch();

  const { userData, loading, error, message } = useSelector(
    (state) => state.auth
  );

  const verifyEmailHandler = () => {
    dispatch(sendVerifyEmail(userData.email));
  };

  const closeModalHandler = () => {
    dispatch(clearResponse());
  };

  return (
    <Card className="account-page">
      <Modal
        on={!!error || !!message}
        header={error ? "Error" : "Email has sent"}
        content={error || message}
        onClose={closeModalHandler}
      />
      <div className="account__profile">
        <div className="account__profile__picture">
          <Avatar width="5rem" height="5rem" />
        </div>
        <div className="account__profile__info">
          <div>{userData.name}</div>
          <div>{userData.email}</div>
          <span className="link">Edit</span>
        </div>
      </div>
      {!userData.isVerified && (
        <Button
          className="account__verification"
          loading={loading}
          onClick={verifyEmailHandler}
        >
          Verify Email
        </Button>
      )}
      {userData.isVerified && !userData.isPremium && (
        <Button className="account__premium">Upgrade to Premium</Button>
      )}
    </Card>
  );
};

export default AccountPage;
