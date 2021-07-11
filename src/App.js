import { useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Layout/Header";
import VideoListPage from "pages/Video/VideoListPage";
import LoginPage from "pages/Auth/LoginPage";
import UploadVideoPage from "pages/Upload/UploadVideoPage";
import UploadContextProvider from "context/upload-context";
import { AuthContext } from "context/auth-context";
import "./App.css";

const App = () => {
  const { token } = useContext(AuthContext);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />

        <Route exact path="/upload">
          <UploadContextProvider>
            <UploadVideoPage />
          </UploadContextProvider>
        </Route>

        <Redirect exact to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={VideoListPage} />

        {/* Only available in Development */}
        <Route exact path="/upload">
          <UploadContextProvider>
            <UploadVideoPage />
          </UploadContextProvider>
        </Route>
        {/* /> */}

        <Route exact path="/login" component={LoginPage} />

        <Redirect exact to="/login" />
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
