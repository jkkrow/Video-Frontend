import { useSelector } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Layout/Header";
import VideoListPage from "pages/Video/VideoListPage";
import AuthPage from "pages/Auth/AuthPage";
import VerifyEmailPage from "pages/Auth/VerifyEmailPage";
import SendRecoveryEmailPage from "pages/Auth/SendRecoveryEmailPage";
import ResetPasswordPage from "pages/Auth/ResetPasswordPage";
import UserVideoListPage from "pages/User/UserVideoListPage";
import UploadVideoPage from "pages/Upload/UploadVideoPage";
import AccountPage from "pages/User/AccountPage";
import "./App.css";

const App = () => {
  const { token } = useSelector((state) => state.auth);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />
        <Route exact path="/my-videos" component={UserVideoListPage} />
        <Route exact path="/upload" component={UploadVideoPage} />
        <Route
          exact
          path="/auth/verify-email/:token"
          component={VerifyEmailPage}
        />
        <Route exact path="/account" component={AccountPage} />
        <Redirect exact to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />
        {/* Only available in Development */}
        <Route exact path="/my-videos" component={UserVideoListPage} />
        <Route exact path="/upload" component={UploadVideoPage} />
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
