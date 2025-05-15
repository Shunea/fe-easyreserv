import { createSlice } from "@reduxjs/toolkit";
import { ReservationShowComponent } from "../Types";
import moment from "moment";

const initialReservationShowComponent: ReservationShowComponent = {
  component: "no-reservation",
  date: moment(),
  currentTable: "",
  clickedReservation: "",
  space: ''
};
const reservationShowComponentSlice = createSlice({
  name: "reservation-show-component",
  initialState: initialReservationShowComponent,
  reducers: {
    showNoReservation(state) {
      state.component = "no-reservation";
    },
    showSchedule(state) {
      state.component = "schedule";
    },
    showDetails(state) {
      state.component = "details";
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setCurrentTable(state, action) {
      state.currentTable = action.payload;
    },
    setClickedReservation(state, action) {
      state.clickedReservation = action.payload;
    },
  },
});

export const reservationShowComponentActions =
  reservationShowComponentSlice.actions;

export default reservationShowComponentSlice.reducer;
