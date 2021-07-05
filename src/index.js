import ReactDOM from "react-dom";

import AuthContextProvider from "context/auth-context";
import App from "./App";

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
