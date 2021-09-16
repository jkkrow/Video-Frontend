import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import Header from "components/Layout/Header";
import Footer from "components/Layout/Footer";
import GuestRoute from "routes/GuestRoute";
import UserRoute from "routes/UserRoute";
import {
  logout,
  updateRefreshToken,
  updateAccessToken,
} from "store/actions/auth";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();

  const { refreshToken, userData } = useSelector((state) => state.auth);
  const { uploadTree } = useSelector((state) => state.upload);

  useEffect(() => {
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

    if (!refreshToken) return;

    if (refreshToken.expiresIn > Date.now()) {
      dispatch(updateRefreshToken(refreshToken.value));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!refreshToken) return;

    let timer = setInterval(() => {
      dispatch(updateAccessToken(refreshToken.value));
    }, 1000 * 60 * 14);

    return () => {
      clearInterval(timer);
    };
  }, [dispatch, refreshToken]);

  useEffect(() => {
    if (!uploadTree.root) return;

    const beforeunloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeunloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeunloadHandler);
    };
  }, [uploadTree]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        {userData && <UserRoute />}
        {!userData && <GuestRoute />}
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
