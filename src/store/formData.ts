import { createSlice } from "@reduxjs/toolkit";
import { CreatePlaceFormData } from "../Types";

const initialFormData: CreatePlaceFormData = {
  placeId: '',
  restaurantId: '',
  file: {},
  planId: "",
  lat: 0,
  lng: 0,
  sector: { label: '', value: '' },
  place: {
    type: "",
    name: "",
    category: "",
  },
  imageKey: "",
  schedule: {
    monday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    tuesday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    wednesday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    thursday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    friday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    saturday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    sunday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
  },
  scheduleForDB: {
    monday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    tuesday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    wednesday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    thursday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    friday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    saturday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
    sunday: {
      isOpen: false,
      openingTime: "",
      closingTime: "",
    },
  },
  spaces: [],
  scheduleIsValid: false,
  // location: { label: '', value: '' },
  location: '',

  phoneNumber: "",
  email: "",
  images: [],
};
const formDataSlice = createSlice({
  name: "create-place-form-data",
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
    setImageKey(state, action) {
      state.imageKey = action.payload;
    },
    setPlaceId(state, action) {
      state.placeId = action.payload;
    },
    setRestaurantId(state, action) {
      state.restaurantId = action.payload;
    },
    setCategory(state, action) {
      state.place.category = action.payload;
    },
    setSchedule(state, action) {
      state.schedule = action.payload;
    },
    setScheduleForDB(state, action) {
      state.scheduleForDB = action.payload;
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
            if (
              action.payload[day].openingTime === "" ||
              action.payload[day].closingTime === ""
            ) {
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
    setLat(state, action) {
      state.lat = action.payload;
    },
    setLng(state, action) {
      state.lng = action.payload;
    },
    setSector(state, action) {
      state.sector = action.payload;
    },
    setImages(state, action) {
      state.images = action.payload;
    },
    setSpaces(state, action) {
      state.spaces = action.payload;
    },
    setAll(state, action) {
      state.place.type = action.payload;
      state.place.name = action.payload;
      state.place.category = action.payload;
      state.placeId = action.payload;
      state.restaurantId = action.payload;
      state.file = {};
      state.schedule = {
        monday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        tuesday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        wednesday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        thursday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        friday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        saturday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        sunday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
      };
      state.scheduleForDB = {
        monday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        tuesday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        wednesday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        thursday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        friday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        saturday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
        sunday: {
          isOpen: false,
          openingTime: "",
          closingTime: "",
        },
      };
      state.spaces = [];
      state.scheduleIsValid = false;
      // state.location = { label: '', value: '' };
      state.location = '';
      state.phoneNumber = "";
      state.email = "";
      state.images = [];
    },
  },
});

export const createPlaceFormDataActions = formDataSlice.actions;

export default formDataSlice.reducer;
