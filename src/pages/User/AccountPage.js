import { useDispatch } from "react-redux";

import { logout } from "store/actions/auth";
import "./AccountPage.css";

const AccountPage = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <ul className="account-page">
      <li onClick={logoutHandler}>Logout</li>
    </ul>
  );
};

export default AccountPage;
