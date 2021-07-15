import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/auth";
import uploadReducer from "./reducers/upload";

const store = configureStore({
  reducer: { auth: authReducer, upload: uploadReducer },
});

export default store;
