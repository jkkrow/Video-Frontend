import { Switch, Route, Redirect } from "react-router-dom";

import VideoListPage from "pages/Video/VideoListPage";
import AuthPage from "pages/Auth/AuthPage";
import VerifyEmailPage from "pages/Auth/VerifyEmailPage";
import SendRecoveryEmailPage from "pages/Auth/SendRecoveryEmailPage";
import ResetPasswordPage from "pages/Auth/ResetPasswordPage";

const GuestRoute = () => (
  <Switch>
    <Route exact path="/" component={VideoListPage} />
    <Route exact path="/auth/verify-email/:token" component={VerifyEmailPage} />

    <Route exact path="/auth" component={AuthPage} />
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

export default GuestRoute;
