import { configureStore } from "@reduxjs/toolkit";
import formDataReducer from "./formData";
import backgroundImageReducer from "./sideImageBackground";
import reservationShowComponentReducer from "./reservationShowComponent";
const store = configureStore({
  middleware: (
    getDefaultMiddleware: (arg0: { serializableCheck: boolean }) => any
  ) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    formData: formDataReducer,
    backgroundImage: backgroundImageReducer,
    reservationShowComponent: reservationShowComponentReducer,
  },
});
export default store;
