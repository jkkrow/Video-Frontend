import { useContext } from "react";
import { NavLink } from "react-router-dom";

import IconButton from "components/UI/IconButton";
import { AuthContext } from "context/auth-context";
import "./Header.css";

const Header = () => {
  const { token } = useContext(AuthContext);

  return (
    <header className="header">
      <NavLink exact to="#" className="header__logo">
        Logo
      </NavLink>

      <div className="header__search">
        <IconButton className="search" />
      </div>

      {token ? (
        <div>Profile</div>
      ) : (
        <NavLink exact to="#">
          SIGN UP
        </NavLink>
      )}
    </header>
  );
};

export default Header;
