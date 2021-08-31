import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

import Logo from "components/UI/Logo";
import Search from "components/UI/Search";
import Menu from "./Menu";
import "./Header.css";

const Header = () => {
  const { userData } = useSelector((state) => state.auth);

  const [displayMenu, setDisplayMenu] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setDisplayMenu(false);
  }, [location]);

  const displayMenuHandler = () => {
    setDisplayMenu((prev) => !prev);
  };

  return (
    <header className="header">
      <NavLink exact to="/" className="header__logo">
        <Logo />
      </NavLink>

      <Search />

      {userData ? (
        <div className="link" onClick={displayMenuHandler}>
          {userData.name.toUpperCase()}
        </div>
      ) : (
        <NavLink exact to="/auth">
          SIGN IN
        </NavLink>
      )}

      <Menu on={displayMenu} />
    </header>
  );
};

export default Header;
