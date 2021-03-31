import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import ContextRoute from "./context/ContextRoute";
import VideoPage from "./pages/VideoPage";
import UploadVideoPage from "./pages/UploadVideoPage";
import UploadContextProvider from "./context/upload-context";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <ContextRoute
          exact
          path="/"
          Provider={UploadContextProvider}
          Component={UploadVideoPage}
        />
        <Route exact path="/video" component={VideoPage} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
