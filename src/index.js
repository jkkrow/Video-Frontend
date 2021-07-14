import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "store/index";
import AuthContextProvider from "context/auth-context";
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>,
  document.getElementById("root")
);
