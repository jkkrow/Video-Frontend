import { createPortal } from "react-dom";
import { NavLink, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "store/actions/auth";
import { removeTree } from "store/actions/upload";
import "./Menu.css";

const Menu = ({ on }) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const history = useHistory();

  const logoutHandler = () => {
    dispatch(removeTree());
    dispatch(logout());
    history.push("/auth");
  };

  return createPortal(
    <CSSTransition
      in={on && !!token}
      classNames="menu"
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      <div className="menu">
        <ul className="menu__list">
          <li>
            <NavLink activeStyle={{ opacity: 0.7 }} to="/account">
              Account
            </NavLink>
          </li>
          <li>
            <NavLink activeStyle={{ opacity: 0.7 }} to="/my-videos">
              My Videos
            </NavLink>
          </li>
          <li>
            <NavLink activeStyle={{ opacity: 0.7 }} to="/history">
              History
            </NavLink>
          </li>
          <li>
            <div className="link" onClick={logoutHandler}>
              Logout
            </div>
          </li>
        </ul>
      </div>
    </CSSTransition>,
    document.getElementById("menu-hook")
  );
};

export default Menu;
