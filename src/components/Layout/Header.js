import { memo } from "react";

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Logo from "components/UI/Logo";
import Search from "components/UI/Search";
import "./Header.css";

const Header = () => {
  const { token, userData } = useSelector((state) => state.auth);

  return (
    <header className="header">
      <NavLink exact to="/" className="header__logo">
        <Logo />
      </NavLink>

      <Search />

      {token ? (
        <NavLink exact to="/account">
          {userData.name.toUpperCase()}
        </NavLink>
      ) : (
        <NavLink exact to="/login">
          SIGN IN
        </NavLink>
      )}
    </header>
  );
};

export default memo(Header);
