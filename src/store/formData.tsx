import { createSlice } from '@reduxjs/toolkit';
import { CreatePlaceFormData } from '../Types';
const initialFormData: CreatePlaceFormData = {
  file: {},
  planId: "",
  place: {
    type: '',
    name: '',
    category: ''
  },
  placeId: '',
  restaurantId: '',
  imageKey: '',
  scheduleForDB: {
    monday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    tuesday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    wednesday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    thursday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    friday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    saturday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    sunday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
  },
  schedule: {
    monday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    tuesday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    wednesday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    thursday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    friday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    saturday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
    sunday: {
      isOpen: false,
      openingTime: '',
      closingTime: '',
    },
  },
  spaces: [],
  scheduleIsValid: false,
  location: '',
  phoneNumber: '',
  email: '',
  images: []
}
const formDataSlice = createSlice({
  name: 'create-place-form-data',
  initialState: initialFormData,
  reducers: {
    setFile(state, action) {
      state.file = action.payload;
    },
    setPlanId(state, action) {
      state.planId = action.payload;
    },
    setPlaceType(state, action) {
      state.place.type = action.payload;
    },
    setName(state, action) {
      state.place.name = action.payload;
    },
    setCategory(state, action) {
      state.place.category = action.payload;
    },
    setSchedule(state, action) {
      state.schedule = action.payload;
    },
    checkSchedule(state, action) {
      for (const day in action.payload) {
        if (action.payload.hasOwnProperty(day)) {
          if (!action.payload[day].isOpen) {
            state.scheduleIsValid = false;
          }
        }
      }
      for (const day in action.payload) {
        if (action.payload.hasOwnProperty(day)) {
          if (action.payload[day].isOpen) {
            if (action.payload[day].openingTime === '' || action.payload[day].closingTime === '') {
              state.scheduleIsValid = false;
              return;
            } else {
              state.scheduleIsValid = true;
            }
          }
        }
      }
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    setImages(state, action) {
      state.images = action.payload;
    },
  }
});
export const createPlaceFormDataActions = formDataSlice.actions;
export default formDataSlice.reducer;