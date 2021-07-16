import { useSelector } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Layout/Header";
import VideoListPage from "pages/Video/VideoListPage";
import AuthPage from "pages/Auth/AuthPage";
import UploadVideoPage from "pages/Upload/UploadVideoPage";
import "./App.css";

const App = () => {
  const { token } = useSelector((state) => state.auth);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />
        <Route exact path="/upload" component={UploadVideoPage} />
        <Redirect exact to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />
        {/* Only available in Development */}
        <Route exact path="/upload" component={UploadVideoPage} />
        {/* /> */}
        <Route exact path="/auth" component={AuthPage} />
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
