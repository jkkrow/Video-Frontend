import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import Logo from "components/UI/Logo";
import Search from "components/UI/Search";
import { logout } from "store/actions/auth";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const { token, userData } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <NavLink exact to="/" className="header__logo">
        <Logo />
      </NavLink>

      <Search />

      {token ? (
        <div onClick={logoutHandler}>{userData.name}</div>
      ) : (
        <NavLink exact to="/login">
          SIGN IN
        </NavLink>
      )}
    </header>
  );
};

export default Header;
