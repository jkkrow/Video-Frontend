import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import ContextRoute from "context/ContextRoute";
import VideoPage from "pages/VideoPage";
import UploadVideoPage from "pages/UploadVideoPage";
import UploadContextProvider from "context/upload-context";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={VideoPage} />
        <ContextRoute
          exact
          path="/upload"
          Provider={UploadContextProvider}
          Component={UploadVideoPage}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
