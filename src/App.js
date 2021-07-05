import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Layout/Header";
import VideoPage from "pages/Video/VideoPage";
import UploadVideoPage from "pages/Upload/UploadVideoPage";
import UploadContextProvider from "context/upload-context";
import "./App.css";

const App = () => {
  const routes = (
    <Switch>
      <Route exact path="/" component={VideoPage} />

      <Route exact path="/upload">
        <UploadContextProvider>
          <UploadVideoPage />
        </UploadContextProvider>
      </Route>

      <Redirect to="/" />
    </Switch>
  );

  return (
    <BrowserRouter>
      <Header />
      <main>{routes}</main>
      <footer></footer>
    </BrowserRouter>
  );
};

export default App;
