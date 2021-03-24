import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

const VideoComponent = React.lazy(() => import("./pages/Video"));
const VideoUploadComponent = React.lazy(() => import("./pages/VideoUpload"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={VideoComponent} />
          <Route path="/upload" component={VideoUploadComponent} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
