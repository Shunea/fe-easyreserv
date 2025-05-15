import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { deleteIconCommunication } from "src/icons/icons";
import classes from "../AddCategory/NewCategory.module.css";
import classesMessage from "../AddMessage/NewMessage.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { messageData } from "./EditMessage";
interface FilterRecipientProps {
  onFilterChange: (
    clientStatus: string,
    // lastVisit: Date | null
    // orderPriceFrom: string,
    // orderPriceTo: string,
    // orderCategory: string,
    // timeOfTheDay: string
  ) => void;
}

const newTheme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          width: "320px",
          borderWidth: 0,
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginTop: "60px",
        },
      },
    },
    //@ts-ignore
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          position: "relative",
          top: "20px",
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekContainer: {
          position: "relative",
          top: "40px",
        },
        weekDayLabel: {
          position: "relative",
          top: "10px",
        },
      },
    },
  },
});
interface ClearableDatePickerProps {
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  onClear: () => void;
}

const ClearableDatePicker: React.FC<ClearableDatePickerProps> = ({
  value,
  onChange,
  onClear,
}) => {
  return (
    <div className={classes.FilterClient}>
      <DatePicker
        value={value}
        onChange={onChange}
        slotProps={{
          inputAdornment: {
            position: "start",
          },
          field: {},
        }}
        sx={{
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      />
      <span className={classes.SelectLine}></span>
      <div className={classes.Actions}>
        <button onClick={onClear} className={classes.DeleteButton}>
          {deleteIconCommunication}
        </button>
      </div>
    </div>
  );
};
const EditFilterRecipient: React.FC<FilterRecipientProps> = ({
  onFilterChange,
}) => {
  const [clientStatus, setClientStatus] = React.useState<string>("");
  // const [lastVisit, setLastVisit] = React.useState<Date | null>(null);
  const [priceRange, setPriceRange] = React.useState<{
    min: string;
    max: string;
  }>({
    min: "",
    max: "",
  });

  const [orderCategory, setOrderCategory] = React.useState<string>("");
  const [timeOfTheDay, setTimeOfTheDay] = React.useState<string>("");

  const handleClientStatusChange = (event: SelectChangeEvent) => {
    setClientStatus(event.target.value);
    onFilterChange(event.target.value);
    // onFilterChange(event.target.value, lastVisit);
  };

  // const handleLastVisitChange = (newValue: Date | null) => {
  //   setLastVisit(newValue);
  //   onFilterChange(clientStatus, newValue);
  // };

  // const handleOrderPriceFromChange = (event: SelectChangeEvent) => {
  //   setPriceRange((prev) => ({ ...prev, min: event.target.value }));
  //    onFilterChange(event.target.value, orderPriceFrom);
  // };

  // const handleOrderPriceToChange = (event: SelectChangeEvent) => {
  //   setPriceRange((prev) => ({ ...prev, max: event.target.value }));
  //    onFilterChange(event.target.value, orderPriceTo);
  // };

  // const handleOrderCategoryChange = (event: SelectChangeEvent) => {
  //   setOrderCategory(event.target.value);
  //    onFilterChange(event.target.value, orderCategory);
  // };

  // const handleTimeOfTheDayChange = (event: SelectChangeEvent) => {
  //   setTimeOfTheDay(event.target.value);
  //    onFilterChange(event.target.value, timeOfTheDay);
  // };
  const ClientStatusOptions = [
    { value: "ALL_USERS", label: "All users easyReserv " },
    { value: "ALL_CLIENTS", label: "All Clients" },
    { value: "RECURRENT", label: "Recurrent Client" },
    { value: "NEW", label: "New Client" },
  ];
  const CategoryOptions = [
    { value: "one category", label: "one category" },
    { value: "second category", label: "second category" },
  ];
  const TimeOptions = [
    { value: "11:00", label: "11:00" },
    { value: "12:00", label: "12:00" },
  ];
  const PriceOptions = [
    { value: "1100", label: "1100" },
    { value: "1200", label: "1200" },
  ];
  const resetClientStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setClientStatus("");
  };

  // const resetPriceRange = () => {
  //   setPriceRange({ min: "", max: "" });
  // };

  // const resetOrderCategory = () => {
  //   setOrderCategory("");
  // };

  // const resetTimeOfTheDay = () => {
  //   setTimeOfTheDay("");
  // };

  return (
    <div className={classes.FilterContainer}>
      <label htmlFor="filter" className={classes.label}>
        Filter recipients by
      </label>
      <div className={classes.Filter}>
        <div className={classes.FilterClient}>
          <p className={classes.FilterText}>Client Status</p>
          <span className={classes.SelectLine}></span>
          <FormControl sx={{ mt: 0.5, minWidth: 120 }}>
            <Select
              value={clientStatus}
              onChange={handleClientStatusChange}
              displayEmpty
              className={classesMessage.selectFieldClientStatus}
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
            >
              <MenuItem disabled value="">
                <p className={classesMessage.menuItem}>Select Client Status</p>
              </MenuItem>
              {ClientStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <p className={classesMessage.MenuOptions}>{option.label}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className={classes.SelectLine}></span>
          <div className={classes.Actions}>
            <button
              className={classes.DeleteButton}
              onClick={resetClientStatus}
            >
              {deleteIconCommunication}
            </button>
          </div>
        </div>
        {/* <div className={classes.FilterClient}>
          <p className={classes.FilterText}>Last Visit</p>
          <span className={classes.SelectLine}></span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{ display: "flex", gap: "24px" }}
            >
              <ThemeProvider theme={newTheme}>
                <DemoItem>
                  <ClearableDatePicker
                    value={lastVisit}
                    onChange={handleLastVisitChange}
                    onClear={() => {
                      setLastVisit(null);
                    }}
                  />
                </DemoItem>
              </ThemeProvider>
            </DemoContainer>
          </LocalizationProvider>
        </div> */}
        {/* <div className={classes.FilterClient}>
          <p className={classes.FilterText}>Order Price</p>
          <span className={classes.SelectLine}></span>
          <FormControl sx={{ mt: 0.5, minWidth: 120 }}>
            <Select
              {...register("orderPriceFrom", { required: true })}
              value={priceRange.min}
              onChange={handleOrderPriceFromChange}
              displayEmpty
              className={classesMessage.selectFieldPrice}
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiSelect-icon": { display: "none" },
              }}
            >
              <MenuItem disabled value="">
                <p className={classesMessage.menuItem}>From</p>
              </MenuItem>
              {PriceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <p className={classesMessage.MenuOptions}>{option.label}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 0.5, minWidth: 120 }}>
            <Select
              {...register("orderPriceTo", { required: true })}
              value={priceRange.max}
              onChange={handleOrderPriceToChange}
              displayEmpty
              className={classesMessage.selectFieldPrice}
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiSelect-icon": { display: "none" },
              }}
            >
              <MenuItem disabled value="">
                <p className={classesMessage.menuItem}>To</p>
              </MenuItem>
              {PriceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <p className={classesMessage.MenuOptions}>{option.label}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className={classes.SelectLine}></span>
          <div className={classes.Actions}>
            <button className={classes.DeleteButton} onClick={resetPriceRange}>
              {deleteIconCommunication}
            </button>
          </div>
        </div>
        <div className={classes.FilterClient}>
          <p className={classes.FilterText}>Order Category</p>
          <span className={classes.SelectLine}></span>
          <FormControl sx={{ mt: 0.5, minWidth: 120 }}>
            <Select
              {...register("orderCategory", { required: true })}
              value={orderCategory}
              onChange={handleOrderCategoryChange}
              displayEmpty
              className={classesMessage.selectFieldClientStatus}
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
            >
              <MenuItem disabled value="">
                <p className={classesMessage.menuItem}>Select Category</p>
              </MenuItem>
              {CategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <p className={classesMessage.MenuOptions}>{option.label}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className={classes.SelectLine}></span>
          <div className={classes.Actions}>
            <button
              className={classes.DeleteButton}
              onClick={resetOrderCategory}
            >
              {deleteIconCommunication}
            </button>
          </div>
        </div>
        <div className={classes.FilterClient}>
          <p className={classes.FilterText}>Time of the day</p>
          <span className={classes.SelectLine}></span>
          <FormControl sx={{ mt: 0.5, minWidth: 120 }}>
            <Select
              {...register("timeOfTheDay", { required: true })} // Register discount field
              value={timeOfTheDay}
              onChange={handleTimeOfTheDayChange}
              displayEmpty
              className={classesMessage.selectFieldClientStatus}
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
            >
              <MenuItem disabled value="">
                <p className={classesMessage.menuItem}>Select Time</p>
              </MenuItem>
              {TimeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <p className={classesMessage.MenuOptions}>{option.label}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className={classes.SelectLine}></span>
          <div className={classes.Actions}>
            <button
              className={classes.DeleteButton}
              onClick={resetTimeOfTheDay}
            >
              {deleteIconCommunication}
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default EditFilterRecipient;
