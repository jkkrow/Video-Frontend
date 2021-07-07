import { useContext } from "react";
import { NavLink } from "react-router-dom";

import Search from "components/UI/Search";
import { AuthContext } from "context/auth-context";
import "./Header.css";

const Header = () => {
  const { token, userData, logoutHandler } = useContext(AuthContext);

  return (
    <header className="header">
      <NavLink exact to="/" className="header__logo">
        Logo
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
