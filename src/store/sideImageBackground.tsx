import { createSlice } from "@reduxjs/toolkit";
import { BackgroundImageState } from "../Types";
const initialbackgroundImage: BackgroundImageState = {
  backgroundImage: "",
};
const backgroundImageSlice = createSlice({
  name: "background-image",
  initialState: initialbackgroundImage,
  reducers: {
    changeBackground(state, action) {
      state.backgroundImage = action.payload;
    },
  },
});
export const backgroundImageActions = backgroundImageSlice.actions;
export default backgroundImageSlice.reducer;
