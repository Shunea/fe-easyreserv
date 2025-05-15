import React, { useEffect, useState } from "react";

import classes from "./Schedule.module.css";
import { workingHours } from "./options";
import { scheduleStyle, scheduleCornerStyle } from "./../../../UI/selectStyles";
import { Form } from "react-bootstrap";
import Select from "../../../UI/Select";
import { components } from "react-select";
import useMask from "../../../hooks/use-mask";
import { useDispatch, useSelector } from "react-redux";
import { createPlaceFormDataActions } from "../../../store/formData";
import { useLocation } from "react-router-dom";
import { getRestaurantById } from "src/auth/api/requests";

const MaskedInput = (props: any) => {
  const { onInput, onKeyDown } = useMask.timeHour();

  return (
    <components.Input {...props} onInput={onInput} onKeyDown={onKeyDown} />
  );
};
const Schedule = () => {
  const location = useLocation();
  const isEditPlace = location.pathname === "/edit-place/create";
  let scheduleFromRedux = useSelector((state: any) => state.formData.schedule);
  let initialState = { ...scheduleFromRedux };
  const [days, setDays] = useState(() => {
    return initialState;
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState();
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(storedRestaurant.id);
        if (restaurantData.placeId === storedRestaurant.placeId) {
          setSelectedRestaurant(restaurantData);
          const { workSchedule } = restaurantData;
          const formattedSchedule = {};
          for (let day in workSchedule) {
            const { isOpen, openingTime, closingTime } = workSchedule[day];
            formattedSchedule[day] = {
              isOpen: isOpen,
              openingTime: { value: openingTime, label: openingTime },
              closingTime: { value: closingTime, label: closingTime },
            };
          }
          setDays(formattedSchedule);
        }
      } catch (error) {
        console.error("Error fetching restaurant data", error);
      }
    };

    if (isEditPlace && storedRestaurant) {
      fetchRestaurantData();
    }
  }, [isEditPlace]);
  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [isToggleChecked, setIsToggleChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createPlaceFormDataActions.setSchedule(days));
    let i = 0;
    let workScheduleForDB = {};
    for (let day in days) {
      let a = Object.keys(days)[i];
      workScheduleForDB[a] = {
        isOpen: days[day].isOpen,
        openingTime: days[day].openingTime.value || "",
        closingTime: days[day].closingTime.value || "",
      };
      i++;
    }
    dispatch(createPlaceFormDataActions.setScheduleForDB(workScheduleForDB));
    dispatch(createPlaceFormDataActions.checkSchedule(days));
  }, [days, dispatch]);

  const handleDay = (weekday: any) => {
    setDays((prevState: any) => ({
      ...prevState,
      [weekday]: {
        ...prevState[weekday],
        isOpen: !prevState[weekday].isOpen,
        openingTime: "",
        closingTime: "",
      },
    }));
  };

  const handleSelectChange = (weekday: any, type: string, selected: any) => {
    if (selected !== void 0) {
      setDays((prevState: any) => ({
        ...prevState,
        [weekday]: {
          ...prevState[weekday],
          [type]: selected,
        },
      }));
      if (weekday === "monday") {
        if (isToggleChecked) {
          weekdays.forEach((weekday) => {
            setDays((prevState: any) => ({
              ...prevState,
              [weekday]: {
                ...prevState[weekday],
                [type]: selected,
              },
            }));
          });
        }
      }
    }
  };

  const handleToggle = () => {
    setIsToggleChecked(!isToggleChecked);
    if (!isToggleChecked) {
      weekdays.forEach((weekday) => {
        setDays((prevState: any) => ({
          ...prevState,
          [weekday]: {
            ...prevState[weekday],
            isOpen: true,
            openingTime: days["monday"].openingTime,
            closingTime: days["monday"].closingTime,
          },
        }));
      });
    }
    if (isToggleChecked) {
      weekdays.forEach((weekday) => {
        setDays((prevState: any) => ({
          ...prevState,
          [weekday]: {
            ...prevState[weekday],
            isOpen: false,
            openingTime: "",
            closingTime: "",
          },
        }));
      });
    }
  };

  return (
    <div className={classes.schedule}>
      <p className={classes.label}>Work schedule</p>
      {weekdays.map((day) => {
        const isMonday = day === "monday";
        return (
          <div className={classes.schedule_row} key={day}>
            <div
              className={`${classes.day} ${
                isMonday ? classes.corner_top_left : ""
              }`}
            >
              <input
                type="checkbox"
                id={day}
                className="form-check-input"
                checked={days[day]?.isOpen}
                disabled={isToggleChecked}
                onChange={() => handleDay(day)}
              />
              <label htmlFor={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            </div>
            <div className={classes.hours}>
              <div>
                <Select
                  styles={scheduleStyle}
                  id={`from${day}`}
                  key={`from${day}`}
                  name={`from${day}`}
                  maxMenuHeight={150}
                  placeholder="From"
                  options={workingHours}
                  disabled={!days[day].isOpen || (isToggleChecked && !isMonday)}
                  value={days[day].openingTime}
                  onChange={(selected: any) => {
                    handleSelectChange(day, "openingTime", selected);
                  }}
                  components={{ Input: MaskedInput }}
                />
              </div>
              <div>
                <Select
                  styles={isMonday ? scheduleCornerStyle : scheduleStyle}
                  id={`until${day}`}
                  key={`until${day}`}
                  name={`until${day}`}
                  maxMenuHeight={150}
                  placeholder="Until"
                  options={workingHours}
                  disabled={!days[day].isOpen || (isToggleChecked && !isMonday)}
                  value={days[day].closingTime}
                  onChange={(selected: any) => {
                    handleSelectChange(day, "closingTime", selected);
                  }}
                  components={{ Input: MaskedInput }}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className={` ${classes.bottom_row}`}>
        <label htmlFor="toggle-switch" className={classes.toggle_label}>
          Keep the same hours for every working day
        </label>
        <Form.Check
          className={classes.toggle}
          type="switch"
          id="toggle-switch"
          checked={isToggleChecked}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
};
export default Schedule;
