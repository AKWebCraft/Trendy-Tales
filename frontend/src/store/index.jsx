import { configureStore } from "@reduxjs/toolkit";
import user from "../store/userSlice";

const store = configureStore({
  reducer: { user },
});

export default store;
