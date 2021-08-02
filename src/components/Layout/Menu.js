import { createPortal } from "react-dom";
import { NavLink, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "store/actions/auth";
import "./Menu.css";

const Menu = ({ on }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const history = useHistory();

  const logoutHandler = () => {
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
        <NavLink to="/#">Account</NavLink>
        <NavLink to="/my-videos">My Videos</NavLink>
        <NavLink to="#">History</NavLink>
        <div className="link" onClick={logoutHandler}>
          Logout
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("menu-hook")
  );
};

export default Menu;
