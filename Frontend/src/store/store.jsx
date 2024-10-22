import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice"
import adminSlice from "./slice/adminSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
  },
});
export default store;
