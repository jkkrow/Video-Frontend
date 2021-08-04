import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Layout/Header";
import VideoListPage from "pages/Video/VideoListPage";
import AuthPage from "pages/Auth/AuthPage";
import VerifyEmailPage from "pages/Auth/VerifyEmailPage";
import SendRecoveryEmailPage from "pages/Auth/SendRecoveryEmailPage";
import ResetPasswordPage from "pages/Auth/ResetPasswordPage";
import AccountPage from "pages/User/AccountPage";
import UserVideoListPage from "pages/User/UserVideoListPage";
import UploadVideoPage from "pages/Upload/UploadVideoPage";
import "./App.css";

const App = () => {
  const { token } = useSelector((state) => state.auth);
  const { uploadTree } = useSelector((state) => state.upload);

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

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />
        <Route exact path="/account" component={AccountPage} />
        <Route exact path="/my-videos" component={UserVideoListPage} />
        <Route exact path="/new-video" component={UploadVideoPage} />
        <Route
          exact
          path="/auth/verify-email/:token"
          component={VerifyEmailPage}
        />
        <Redirect exact to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />
        {/* Only available in Development */}
        {/* <Route exact path="/my-videos" component={UserVideoListPage} />
        <Route exact path="/new-video" component={UploadVideoPage} /> */}
        {/* /> */}
        <Route exact path="/auth" component={AuthPage} />
        <Route
          exact
          path="/auth/verify-email/:token"
          component={VerifyEmailPage}
        />
        <Route
          exact
          path="/auth/send-recovery-email"
          component={SendRecoveryEmailPage}
        />
        <Route
          exact
          path="/auth/reset-password/:token"
          component={ResetPasswordPage}
        />
        <Redirect exact to="/auth" />
      </Switch>
    );
  }

  return (
    <BrowserRouter>
      <Header />
      <main>{routes}</main>
      <footer></footer>
    </BrowserRouter>
  );
};

export default App;
