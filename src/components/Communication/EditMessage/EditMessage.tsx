import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import classes from "../AddCategory/NewCategory.module.css";
import classesMessage from "../AddMessage/NewMessage.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  getCommunicationMessageById,
  getCommunicationMessageType,
  updateCommunicationMessageById,
} from "src/auth/api/requests";
import { plusIcon } from "src/icons/icons";
import NewCategory from "../AddCategory/NewCategory";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Select } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/material";
import dayjs from "dayjs";
import EditFilterRecipient from "./EditFilterRecipient";
import OutsideClickHandler from "src/components/Staff/components/OutsideClickHandler";

export type messageData = {
  title: string;
  message: string;
  startDate: Date | null;
  endDate: Date | null;
  discount?: string;
};
const newTheme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "12px !important",
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

const EditMessage = ({ onClose, messageId, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<messageData>();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [discount, setDiscount] = React.useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSD, setSelectedSD] = useState<Date | null>(null);
  const [selectedED, setSelectedED] = useState<Date | null>(null);
  const [types, setTypes] = useState<{ id: string; type: string }[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [clientStatus, setClientStatus] = React.useState("");
  // const [lastVisit, setLastVisit] = React.useState<Date | null>(null);
  const [checked, setChecked] = React.useState(false);
  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleFilterChange = (
    clientStatus: string
    // lastVisit: Date | null
    // orderPriceFrom: string,
    // orderPriceTo: string,
    // orderCategory: string,
    // timeOfTheDay: string
  ) => {
    setClientStatus(clientStatus);
    // setLastVisit(lastVisit);
  };
  const discountOptions = [
    { value: 10, label: "10%" },
    { value: 20, label: "20%" },
    { value: 30, label: "30%" },
  ];
  // const currentHour = new Date().getHours();
  // const currentMinutes = new Date().getMinutes();
  // const workingHours: { value: string; label: string }[] = [];

  // for (let hours = currentHour; hours < 24; hours++) {
  //   const startMinutes = hours === currentHour ? currentMinutes : 0;

  //   for (let minutes = startMinutes + 5; minutes < 60; minutes += 5) {
  //     const formattedHours = String(hours).padStart(2, "0");
  //     const formattedMinutes = String(minutes).padStart(2, "0");
  //     const time = `${formattedHours}:${formattedMinutes}`;
  //     workingHours.push({ value: time, label: time });
  //   }
  // }
  const [workingHours, setWorkingHours] = useState<
    { value: string; label: string }[]
  >([]);

  const updateWorkingHours = (selectedDate: Date | null) => {
    const hoursArray: { value: string; label: string }[] = [];
    const today = new Date();
    const isToday = selectedDate && dayjs(selectedDate).isSame(today, "day");
    const startHour = isToday ? today.getHours() : 0;
    const startMinutes = isToday ? today.getMinutes() + 5 : 0;

    for (let hours = startHour; hours < 24; hours++) {
      const startMinutesForHour =
        isToday && hours === startHour ? startMinutes : 0;

      for (let minutes = startMinutesForHour; minutes < 60; minutes += 5) {
        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const time = `${formattedHours}:${formattedMinutes}`;
        hoursArray.push({ value: time, label: time });
      }
    }

    setWorkingHours(hoursArray);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCategorySelect = (type: string) => {
    const selectedType = types.find((t) => t.type === type);
    if (selectedType) {
      setActiveCategory(type);
      setSelectedTypeId(selectedType.id);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setDiscount(event.target.value);
  };

  const handleStartDateChange = (newValue: Date | null) => {
    setValue("startDate", newValue);
  };
  const handleEndDateChange = (newValue: Date | null) => {
    const endOfDay = newValue ? new Date(newValue) : null;
    // If newValue is not null, set time to end of day (23:59)
    endOfDay?.setHours(23, 59, 59, 0);
    setValue("endDate", endOfDay);
  };
  // const handleMessageOnChange = (newValue: Date | null) => {
  //   setSelectedDate(newValue);
  // };
  const handleMessageOnChange = (newValue: Date | null) => {
    setSelectedDate(newValue);
    updateWorkingHours(newValue);
  };

  const handleChangeTime = (event: SelectChangeEvent) => {
    const selectedTimeValue = event.target.value as string;

    setSelectedTime(selectedTimeValue);
  };
  const combineDateAndTime = (
    selectedDate: Date | null,
    selectedTime: string
  ) => {
    const dateObject = dayjs(selectedDate).format("YYYY-MM-DD");
    const timeObject = selectedTime;

    const combinedDateTime = `${dateObject} ${timeObject}`;
    return combinedDateTime;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommunicationMessageById(messageId);
        // Set initial values for inputs based on the data
        setValue("title", data.title || "");
        setValue("message", data.message || "");
        setValue("startDate", data.startDate || null);
        setValue("endDate", data.endDate || null);
        setValue("discount", data.discount || "");
        setActiveCategory(data.communicationTypes.type || "");
        setSelectedTypeId(data.communicationTypes.id || "");
        const messageStartDate = dayjs(data.startDate);
        //@ts-ignore
        setSelectedSD(messageStartDate);
        const messageEndDate = dayjs(data.endDate);
        //@ts-ignore
        setSelectedED(messageEndDate);
        // Separate the date and time from sendMessageDate
        // const messageDate = dayjs(data.sendMessageDate);
        //@ts-ignore
        // setSelectedDate(messageDate);
        // const messageTime = messageDate.format("HH:mm");
        // setSelectedTime(messageTime);

        // Additional inputs can be handled similarly
        setDiscount(data.discount || "");
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchData();
  }, [messageId, setValue]);

  const onSubmit = async (data: messageData) => {
    try {
      const combinedDateAndTime = combineDateAndTime(
        selectedDate,
        selectedTime
      );
      // Update the data object with the combined date and time
      const newData = {
        ...data,
        sendMessageDate: combinedDateAndTime,
        communicationTypeId: selectedTypeId,
        userFilterDto: {
          clientStatus: clientStatus,
          // lastVisit: lastVisit,
        },
      };
      const updatedData = await updateCommunicationMessageById(
        messageId,
        newData
      );
      toast.success("Message updated");
      onClose();
    } catch (error) {
      toast.error("Error updating/creating message");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCommunicationMessageType();
        const typesFromBackend = response.data;
        setTypes(typesFromBackend);
      } catch (error) {
        console.error("Can't get types:", error);
        // Handle error as needed
      }
    };

    fetchData();
  }, []);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      const isValid =
        watch("title") !== "" &&
        watch("message") !== "" &&
        watch("startDate") !== null &&
        watch("endDate") !== null &&
        // watch("discount") !== "" &&
        selectedTypeId !== undefined &&
        selectedDate !== null &&
        selectedTime !== "" &&
        // lastVisit !== null &&
        clientStatus !== "";

      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [watch()]);
  const FormRef = useRef<HTMLDivElement | null>(null);

  return (
    <form className={classes.formInvite} onSubmit={handleSubmit(onSubmit)}>
      <div ref={FormRef} className={classes.formInviteInputContainer}>
        {/* <OutsideClickHandler innerRef={FormRef} onClose={props.onClose} /> */}
        <h5>General</h5>
        <label htmlFor="title" className={classes.label}>
          Title (max. 70 characters)
        </label>
        <input
          className={classes.formInviteInput}
          type="text"
          id="title"
          placeholder="Enter short and descriptive title"
          {...register("title", { required: true, maxLength: 70 })}
          value={watch("title")}
          onChange={(e) => setValue("title", e.target.value)}
        />
        {errors.title && errors.title.type === "required" && (
          <span>Title is required</span>
        )}
        {errors.title && errors.title.type === "maxLength" && (
          <span>Title cannot exceed 70 characters</span>
        )}
        <label htmlFor="title" className={classes.label}>
          Type
        </label>
        <div className={classesMessage.Filter}>
          {types.map((type) => (
            <p
              key={type.id}
              className={`${classesMessage.categoryItem} ${
                activeCategory === type.type
                  ? classesMessage.ActiveCategory
                  : ""
              }`}
              onClick={() => handleCategorySelect(type.type)}
            >
              {type.type}
            </p>
          ))}
          <button
            className={classesMessage.AddEmployeeButton}
            onClick={handleOpenModal}
          >
            <span className={classesMessage.AddCategoryIcon}>{plusIcon}</span>
            <Typography className={classesMessage.AddEmployeeButtonText}>
              Create category
            </Typography>
          </button>
        </div>
        <label htmlFor="message" className={classes.label}>
          Message
        </label>
        {/* <div className={classesMessage.MessageContainer}>
          {/* <p className="d-flex flex-wrap">
            From <span className={classesMessage.tags}># start-date</span>
            reserve a table to savor our delicious dishes at
            <span className={classesMessage.tags}># discount-value</span>.{" "}
            Limited offer until
            <span className={classesMessage.tags}># end-date</span>.{" "}
          </p>
          {/* <p className="d-flex gap-1">
            <span className={classesMessage.tagspar}>Tags:</span>
            <span className={classesMessage.tags}># start-date</span>
            <span className={classesMessage.tags}># end-date</span>
            <span className={classesMessage.tags}># discount-value</span>
            <span className={classesMessage.tags}># recipent-name</span>
          </p>
        </div> */}
        <TextareaAutosize
          className={classesMessage.MessageContainer}
          placeholder="Select your message"
          minRows={4}
          {...register("message", { required: true })}
          value={watch("message")}
          onChange={(e) => setValue("message", e.target.value)}
        />
        {errors.message && errors.message.type === "required" && (
          <span>Message is required</span>
        )}
        <div className={classesMessage.Dates}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker", "DatePicker"]}
              sx={{ display: "flex", gap: "10px", mt: 0.7 }}
            >
              <ThemeProvider theme={newTheme}>
                <DemoItem>
                  <label
                    htmlFor="startDate"
                    className={classes.label}
                    style={{ marginBottom: "2px" }}
                  >
                    Start Date
                  </label>
                  <DatePicker
                    {...register("startDate", { required: true })}
                    slotProps={{
                      inputAdornment: {
                        position: "start",
                      },
                    }}
                    value={selectedSD}
                    onChange={handleStartDateChange}
                  />
                </DemoItem>
                <DemoItem>
                  <label
                    htmlFor="endDate"
                    className={classes.label}
                    style={{ marginBottom: "2px" }}
                  >
                    End Date
                  </label>
                  <DatePicker
                    {...register("endDate", { required: true })}
                    slotProps={{
                      inputAdornment: {
                        position: "start",
                      },
                    }}
                    value={selectedED}
                    onChange={handleEndDateChange}
                    //@ts-ignore
                    minDate={selectedSD}
                  />
                </DemoItem>
              </ThemeProvider>
            </DemoContainer>
          </LocalizationProvider>
          <div className={classesMessage.SelectFieldContainer}>
            {/* <label htmlFor="discount" className={classes.label}>
              Discount
            </label> */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    size="small"
                    onChange={handleCheckBoxChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Enable Discount"
              />
            </FormGroup>
            <FormControl sx={{ minWidth: 120 }} disabled={!checked}>
              <Select
                {...register("discount")} // Register discount field
                value={discount}
                onChange={handleChange}
                displayEmpty
                className={classesMessage.selectField}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <p className={classesMessage.menuItem}>Select Discount</p>
                </MenuItem>
                {discountOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <h5>Sending setup</h5>
        <div className={classesMessage.SendMessageOn}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{ display: "flex", gap: "24px" }}
            >
              <ThemeProvider theme={newTheme}>
                <DemoItem>
                  <label htmlFor="sendMessageOn" className={classes.label}>
                    Send message on
                  </label>
                  <DatePicker
                    slotProps={{
                      inputAdornment: {
                        position: "start",
                      },
                    }}
                    value={selectedDate}
                    onChange={handleMessageOnChange}
                    //@ts-ignore
                    minDate={dayjs()}
                  />
                </DemoItem>
                <div>
                  <label htmlFor="discount" className={classes.label}>
                    Time
                  </label>
                  <FormControl sx={{ mt: 1, minWidth: 120 }}>
                    <Select
                      value={selectedTime}
                      onChange={handleChangeTime}
                      displayEmpty
                      className={classesMessage.selectFieldTime}
                      MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                      inputProps={{ "aria-label": "Without label" }}
                      disabled={!selectedDate}
                    >
                      <MenuItem disabled value="">
                        <p className={classesMessage.menuItem}>Select Time</p>
                      </MenuItem>
                      {workingHours.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {!selectedDate && (
                      <Typography color="error" style={{ fontSize: "13px" }}>
                        Select the Send message on date first
                      </Typography>
                    )}
                  </FormControl>
                </div>
              </ThemeProvider>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <EditFilterRecipient onFilterChange={handleFilterChange} />
        <div className={classes.InviteModalAction}>
          <Button
            className={classes.InviteModalSubmitButton}
            type="submit"
            variant="outlined"
            size="large"
            disabled={!isFormValid}
          >
            <Typography className={classes.InviteModalSubmitButtonTitle}>
              Save message
            </Typography>
          </Button>
        </div>
      </div>
      {isModalOpen && <NewCategory onClose={handleCloseModal} />}
    </form>
  );
};

export default EditMessage;
