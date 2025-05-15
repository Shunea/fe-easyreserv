import React, { ChangeEventHandler, useState } from "react";
import {
  calendarIconDataUri,
  closeIcon,
  LeftArrow,
} from "../../../../icons/icons";
import CustomSelect from "../components/CustomSelect";
import CustomSelectStyles from "../components/CustomSelectStyles";

import classes from "./AddVacation.module.css";
import {
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
} from "date-fns";
import {
  ClassNames,
  DateRange,
  DayPicker,
  SelectRangeEventHandler,
} from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createVacation } from "../../../../auth/api/requests";
import { toast } from "react-toastify";
import { Employee } from "../../StaffTypes";

type Props = {
  onCancel?: () => void;
  onCloseSideBar?: () => void;
  employee: any;
  AvaliableDays: number;
  SickDays: number;
  SpecialDays: number;
  onVacationAdd?: () => void;
  setEmployee: (updatedEmployee: Employee) => void;
};

const AddVacations = (props: Props) => {
  const [vacationType, setVacationType] = useState("");
  const handleVacationTypeChange = (selectedOption: any) => {
    setVacationType(selectedOption.value);

    const newLeftDays = calculateLeftDays(
      selectedOption.value,
      differenceInDays
    );

    setLeftDays(newLeftDays);
  };

  const vacationTypes = [
    { value: "SIMPLE_VACATION", label: "Vacation" },
    { value: "SICK_VACATION", label: "Sick" },
    { value: "SPECIAL_VACATION", label: "Special" },
  ];

  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");
  const [differenceInDays, setDifferenceInDays] = useState<number>(0);
  const [leftDays, setLeftDays] = useState<number>(props.AvaliableDays);

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFromValue = e.target.value;
    setFromValue(newFromValue);

    const date = parse(newFromValue, "y-MM-dd", new Date());

    if (!isValid(date)) {
      return setSelectedRange({ from: undefined, to: undefined });
    }
    if (selectedRange?.to && isAfter(date, selectedRange.to)) {
      setSelectedRange({ from: selectedRange.to, to: date });
    } else {
      const newEndDate = selectedRange?.from ? selectedRange.from : date;
      setSelectedRange({ from: date, to: newEndDate });
    }
  };

  const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToValue(e.target.value);
    const date = parse(e.target.value, "y-MM-dd", new Date());

    if (!isValid(date)) {
      return setSelectedRange({ from: selectedRange?.from, to: undefined });
    }
    if (selectedRange?.from && isBefore(date, selectedRange.from)) {
      setSelectedRange({ from: date, to: selectedRange.from });
    } else {
      setSelectedRange({ from: selectedRange?.from, to: date });
    }
  };

  const calculateLeftDays = (vacationType: string, daysDifference: number) => {
    if (vacationType === "SICK_VACATION") {
      return props.SickDays - daysDifference;
    } else if (vacationType === "SPECIAL_VACATION") {
      return props.SpecialDays - daysDifference;
    } else {
      return props.AvaliableDays - daysDifference;
    }
  };

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined
  ) => {
    setSelectedRange(range);

    if (range?.from && range?.to) {
      const newDifferenceInDays =
        differenceInCalendarDays(range.to, range.from) + 1;
      let newLeftDays = calculateLeftDays(vacationType, newDifferenceInDays);

      if (vacationType === "SICK_VACATION") {
        newLeftDays = props.SickDays - newDifferenceInDays;
      } else if (vacationType === "SPECIAL_VACATION") {
        newLeftDays = props.SpecialDays - newDifferenceInDays;
      } else {
        newLeftDays = props.AvaliableDays - newDifferenceInDays;
      }

      setFromValue(format(range.from, "dd MMMM yyyy"));
      setToValue(format(range.to, "dd MMMM yyyy"));
      setDifferenceInDays(newDifferenceInDays);
      setLeftDays(newLeftDays);
    } else if (range?.from) {
      setFromValue(format(range.from, "dd MMMM yyyy"));
      setToValue("");
      setDifferenceInDays(1); // Set to 1 day
      setLeftDays(
        vacationType === "SICK_VACATION"
          ? props.SickDays - 1
          : vacationType === "SPECIAL_VACATION"
          ? props.SpecialDays - 1
          : props.AvaliableDays - 1
      );
    } else {
      setFromValue("");
      setToValue("");
      setDifferenceInDays(0);
      setLeftDays(
        vacationType === "SICK_VACATION"
          ? props.SickDays
          : vacationType === "SPECIAL_VACATION"
          ? props.SpecialDays
          : props.AvaliableDays
      );
    }
  };

  const classNames: ClassNames = {
    ...classes,
    month: classes.customMonth,
    multiple_months: classes.multipleMonths,
    caption: classes.caption,
    caption_start: classes.captionStart,
    caption_label: classes.captionLabel,
    nav_button: classes.navButton,
    table: classes.table,
    head: classes.head,
    head_cell: classes.headCell,
    day: classes.day,
    day_outside: classes.dayOutside,
    day_today: classes.today,
    day_range_start: classes.dayRangeStart,
    day_range_middle: classes.dayRangeMiddle,
    day_range_end: classes.dayRangeEnd,
    button: classes.button,
    day_disabled: classes.dayDisabled,
  };

  const notify = () =>
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

  const handleCreateVacation = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const formattedStartDate = format(new Date(fromValue), "yyyy-MM-dd");
      const formattedEndDate = format(
        new Date(toValue ? toValue : fromValue),
        "yyyy-MM-dd"
      );

      const vacationData = {
        startDate: new Date(fromValue),
        endDate: toValue ? new Date(toValue) : new Date(fromValue),
        vacationType: vacationType,
      };
      if (formattedStartDate && !formattedEndDate) {
        vacationData.endDate = vacationData.startDate;
      }
      const createdVacation = await createVacation(
        props.employee.id,
        vacationData
      );

      const updatedEmployee = { ...props.employee };
      updatedEmployee.vacations.push(createdVacation);
      props.setEmployee(updatedEmployee);
      notify();
      props.onVacationAdd?.();
    } catch (error) {
      console.error("Can't add vacation:", error);
    }
  };

  const customStyles = {
    ...CustomSelectStyles,
    control: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
      height: "52px",
      padding: "0px 16px",
      alignItems: "center",
      gap: "8px",
      alignSelf: "stretch",
      borderRadius: "12px",
      background: "var(--brand-snow, #FFF)",
      border: vacationType === "" ? "1px solid red" : "1px solid #EEE",
    }),
  };

  const valid =
    vacationType === "" || fromValue === "" || differenceInDays === 0
      ? false
      : true;

  return (
    <div className={classes.AddVacationBox}>
      <div className={classes.AddVacationHead}>
        <div className={classes.HeadHeading}>
          <button className={classes.BackButton} onClick={props.onCancel}>
            {LeftArrow}
          </button>
          <span className={classes.HeadingTitle}>Schedule new vacation</span>
        </div>
        <div className={classes.HeadActions}>
          <button
            className={classes.CloseButton}
            onClick={props.onCloseSideBar}
          >
            {closeIcon}
          </button>
        </div>
      </div>
      <div className={classes.AddVacationContent}>
        <form className={classes.AddVacationForm}>
          <div className={classes.VacationType}>
            <div className={classes.VacationTypeSelect}>
              <CustomSelect
                onChange={handleVacationTypeChange}
                value={vacationType}
                options={vacationTypes}
                label="Leave request type"
                placeholder="Select vacation type"
                styles={customStyles}
              />
            </div>
            <div className={classes.VacationTypeSelect}></div>
          </div>
          <div className={classes.VacationDays}>
            <label className={classes.DaysLabel}>Request summary</label>
            <div className={classes.TotalDays}>
              <div className={classes.AvaliableDays}>
                <label className={classes.RequestedDaysLabel}>Available:</label>
                <div className={classes.DaysValue}>
                  <span className={classes.AvaliableValueText}>
                    {vacationType === "SICK_VACATION"
                      ? `${props.SickDays} days`
                      : vacationType === "SPECIAL_VACATION"
                      ? `${props.SpecialDays} days`
                      : `${props.AvaliableDays} days`}
                  </span>
                </div>
              </div>
              <div className={classes.RequestedDays}>
                <label className={classes.RequestedDaysLabel}>Requested:</label>
                <div className={classes.DaysValue}>
                  <span className={classes.RequestedValueText}>
                    {differenceInDays > 1
                      ? `${differenceInDays} days`
                      : differenceInDays === 1
                      ? `${differenceInDays} day`
                      : "—"}
                  </span>
                </div>
              </div>
              <div className={classes.LeftDays}>
                <label className={classes.RequestedDaysLabel}>Left:</label>
                <div className={classes.DaysValue}>
                  <span className={classes.LeftValueText}>
                    {`${leftDays <= 0 ? "0" : leftDays} days`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.CalendarContainer}>
            <div className={classes.FromToRow}>
              <div className={classes.DateInput}>
                <label className={classes.DateLabel}>Starting from</label>
                <input
                  size={10}
                  placeholder="Select date"
                  value={fromValue}
                  onChange={handleFromChange}
                  className={classes.DateInputField}
                  style={{
                    backgroundImage: `url(${calendarIconDataUri})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "16px center",
                    paddingLeft: "44px",
                  }}
                />
              </div>
              <div className={classes.DateInput}>
                <label className={classes.DateLabel}>Ending on</label>
                <input
                  size={10}
                  placeholder="Select date"
                  value={toValue}
                  onChange={handleToChange}
                  className={classes.DateInputField}
                  style={{
                    backgroundImage: `url(${calendarIconDataUri})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "16px center",
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              showOutsideDays
              fixedWeeks
              ISOWeek
              max={
                vacationType === "SICK_VACATION"
                  ? props.SickDays
                  : vacationType === "SPECIAL_VACATION"
                  ? props.SpecialDays
                  : props.AvaliableDays
              }
              disabled={vacationType ? false : true}
              classNames={classNames}
              modifiersClassNames={{
                selected: classes.selected,
                today: classes.today,
                caption: classes.caption,
              }}
            />
          </div>
        </form>
      </div>
      <div className={classes.AddVacationActions}>
        <button className={classes.CancelButton} onClick={props.onCancel}>
          <span className={classes.CancelButtonText}>Cancel</span>
        </button>
        <button
          className={classes.SaveButton}
          onClick={handleCreateVacation}
          disabled={!valid}
        >
          <span className={classes.SaveButtonText}>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default AddVacations;
