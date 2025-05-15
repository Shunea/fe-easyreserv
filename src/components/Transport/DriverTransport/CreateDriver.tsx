import { ElementType, useState } from "react";
import { toast } from "react-toastify";
import { createDriver } from "../../../auth/api/requests";
import { LeftArrow } from "../../../icons/icons";
import classes from "./CreateDriver.module.css";
import classesTransport from "../CreateTransport/CreateTransport.module.css";
import { ThemeProvider } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "src/components/Staff/EditEmployee/ScheduleTab/theme";
import dayjs from "dayjs";

type Props = {
  onCancel: () => void;
  onCloseSideBar: () => void;
  setDrivers: any;
  drivers: any[];
};

const CreateDriver = (props: Props) => {
  const [localSerialNumber, setLocalSerialNumber] = useState("");
  const handleSerialNumberChange = (e) => {
    setLocalSerialNumber(e.target.value);
  };
  const [driverName, setDriverName] = useState("");
  const handleEditDriverName = (e) => {
    setDriverName(e.target.value);
  };

  const icon: ElementType<any> = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2.40002 8.03332H21.6M2.40002 8.03332V6.49999C2.40002 4.84313 3.74317 3.49999 5.40002 3.49999H7.20002M2.40002 8.03332V19.2C2.40002 20.8568 3.74317 22.2 5.40002 22.2H18.6C20.2569 22.2 21.6 20.8568 21.6 19.2V8.03332M21.6 8.03332V6.49999C21.6 4.84313 20.2569 3.49999 18.6 3.49999H16.8M8.04708 14.6444L11.2094 17.6667L15.953 13.1333M7.20002 3.49999H16.8M7.20002 3.49999V1.79999M7.20002 3.49999V4.63332M16.8 3.49999V1.79999M16.8 3.49999V4.63332"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const [date, setDate] = useState(null);
  const minYear = 1900;
  const maxYear = 2099;

  const maxDate = dayjs(`${maxYear}-12-31`);

  const handleCardExpireOnChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setDate(newDate);
    } else if (newYear < minYear) {
      setDate(newDate.set("year", minYear));
    } else {
      setDate(newDate.set("year", maxYear));
    }
  };
  const handlecreateDriver = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const driverData = {
        driverName: driverName,
        localSerialNumber: localSerialNumber,
        expirationDate: dayjs(date).format("YYYY-MM-DD"),
      };

      const createdDriver = await createDriver(driverData);
      success();
      const updatedDrivers = [...props.drivers, createdDriver];
      props.setDrivers(updatedDrivers);
      props.onCancel();
    } catch (error) {
      console.error("Can't add transport:", error);
    }
  };

  const success = () =>
    toast.success("Succes!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const disabled =
    driverName === "" || localSerialNumber === "" || date === null;

  return (
    <>
      <div className={classes.AddVacationHead}>
        <div className={classes.HeadHeading}>
          <button className={classes.BackButton} onClick={props.onCancel}>
            {LeftArrow}
          </button>
          <span className={classes.HeadingTitle}>Create driver</span>
        </div>
      </div>
      <div className={classes.BoxForm}>
        <section className={classes.BoxFormSection}>
          <div className={classes.SectionContent}>
            <div className={classes.SectionRow}>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>Driver name</label>
                </div>
                <input
                  type="text"
                  value={driverName}
                  onChange={handleEditDriverName}
                  className={classes.InputField}
                  placeholder="Enter driver name"
                ></input>
              </div>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>Serial number</label>
                </div>
                <input
                  type="text"
                  value={localSerialNumber}
                  onChange={handleSerialNumberChange}
                  className={classes.InputField}
                  placeholder="Serial number"
                ></input>
              </div>
            </div>
            <div className={classes.InputContainer}>
              <ThemeProvider theme={theme}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <div className={classesTransport.StartDate}>
                    <div className={classesTransport.InputLabelContainer}>
                      <label className={classesTransport.InputLabel}>
                        Expiration date
                      </label>
                    </div>
                    <div
                      className={classesTransport.StartDatePicker}
                      style={{ width: "100%" }}
                    >
                      <DesktopDatePicker
                        slots={{ openPickerIcon: icon }}
                        value={date}
                        onChange={handleCardExpireOnChange}
                        maxDate={maxDate}
                        className={classesTransport.StartDatePicker}
                      />
                    </div>
                  </div>
                </LocalizationProvider>
              </ThemeProvider>
            </div>
          </div>
        </section>
      </div>
      <div className={classes.Action}>
        <button
          className={classes.SaveButton}
          onClick={handlecreateDriver}
          disabled={disabled}
        >
          <label className={classes.SaveText}>Save Driver</label>
        </button>
      </div>
    </>
  );
};
export default CreateDriver;
