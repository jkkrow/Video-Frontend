import { Switch, Route, Redirect } from "react-router-dom";

import VideoListPage from "pages/Video/VideoListPage";
import VerifyEmailPage from "pages/Auth/VerifyEmailPage";
import AccountPage from "pages/User/AccountPage";
import UserVideoListPage from "pages/User/UserVideoListPage";
import UploadVideoPage from "pages/Upload/UploadVideoPage";
import HistoryPage from "pages/User/HistoryPage";

const UserRoute = () => (
  <Switch>
    <Route exact path="/" component={VideoListPage} />
    <Route exact path="/auth/verify-email/:token" component={VerifyEmailPage} />

    <Route exact path="/account" component={AccountPage} />
    <Route exact path="/my-videos" component={UserVideoListPage} />
    <Route exact path="/new-video" component={UploadVideoPage} />
    <Route exact path="/history" component={HistoryPage} />
    <Redirect exact to="/" />
  </Switch>
);

export default UserRoute;
