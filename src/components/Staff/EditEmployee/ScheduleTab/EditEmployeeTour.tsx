import { useEffect, useState } from "react";
import { deleteIcon, floorIconUri } from "src/icons/icons";
import CustomSelect from "../components/CustomSelect";
import classes from "./EditEmployeeTour.module.css";
import CustomSelectStyles from "../components/CustomSelectStyles";
import dayjs from "dayjs";
import { getAllSpaces, getRestaurantById } from "../../../../auth/api/requests";
import getTimeOptions from "./TimeOptions";

type Props = {
  employee: any;
  workingDaysCount: any;
  restingDaysCount: any;
  spaceName: any;
  spaneNameChange: any;
  startTime: any;
  startTimeChange: any;
  endTime: any;
  endTimeChange: any;
  tourName: any;
  tourNameChange: any;
  onClose: () => void;
  tours: any;
  tour?: any;
  editTourName?: (newTitle: string) => void;
  color?: any;
  onInvalidTimeChange?: any;
  createSpace?: any;
  handleCreateSpace?: any;
};

const EditEmployeeTour = (props: Props) => {
  // Define spaceNameOptions state variable
  const [spaceNameOptions, setSpaceNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [spaceNameOption, setSpaceNameOption] = useState<
    { value: string; label: string } | undefined
  >();
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await getAllSpaces();
        const RestaurantResponse = await getRestaurantById(
          response.data[0].restaurantId
        );
        setRestaurant(RestaurantResponse);
        // Update spaceNameOptions after fetching spaces
        let updatedSpaceNameOptions = response.data.map((space) => ({
          value: space.id,
          label: space.name,
        }));
        updatedSpaceNameOptions = [
          { value: 'All', label: 'All spaces' },
          ...updatedSpaceNameOptions,
        ];
        setSpaceNameOptions(updatedSpaceNameOptions);

        const option = updatedSpaceNameOptions.find(
          (opt) => opt.label === props.spaceName
        );

        // Handle the case where the option is not found
        if (option) {
          setSpaceNameOption(option);
        } else {
          setSpaceNameOption(undefined); // or set it to a default value if needed
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching spaces:", error);
      }
    };
    fetchSpaces();
  }, [props.spaceName]);

  const customStyles = {
    ...CustomSelectStyles,
    dropdownIndicator: (provided: any) => ({
      ...provided,
      width: "auto",
      height: "auto",
      padding: "0px",
      opacity: "0.35",
    }),
    container: (provided: any) => ({
      ...provided,
      width: "101%",
    }),

    control: (provided: any) => ({
      ...provided,
      gap: "8px",
      padding: "0 16px",
      display: "flex",
      height: "50px",
      alignItems: "center",
      alignSelf: "stretch",
      border: "0",
      background: "var(--brand-snow, #FFF)",
      boxShadow: "none",
      outline: "none",
      "&:before": {
        content: '""',
        display: "inline-block",
        width: "20px",
        height: "20px",
        backgroundImage: `url(${floorIconUri})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      },
    }),
  };

  interface Restaurant {
    workSchedule: {
      [day: string]: {
        isOpen: boolean;
        closingTime: string;
        openingTime: string;
        nextDayOpeningTime: string;
      };
    };
    // ... other properties
  }

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  if (typeof props.onInvalidTimeChange === "function") {
    const invalidTime = props.endTime > props.startTime;
    props.onInvalidTimeChange(invalidTime);
  }

  const timeStyles = {
    ...CustomSelectStyles,
    container: (provided: any) => ({
      ...provided,
      width: "auto",
    }),
    control: (provided: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minHeight: "auto",
      height: "50px",
      justifyContent: "inherit",
      padding: "8px 8px 8px 12px",
      border: props.startTime >= props.endTime ? "0.1px solid red" : 0,
      boxShadow: "none",
      outline: "none",
    }),
    menu: (provided: any) => ({
      ...provided,
      width: "84px",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      width: "16px",
      height: "16px",
      padding: "0px",
      opacity: "0.35",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      flex: "none",
      padding: 0,
    }),
    input: (provided: any) => ({
      ...provided,
      width: "40px",
      color: "var(--brand-charcoal, var(--brand-charcoal, #020202))",
      fontFamily: "Inter",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "100%",
      opacity: "0.35",
      margin: 0,
      padding: 0,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      width: "40px",
      color: "var(--brand-charcoal, var(--brand-charcoal, #020202))",
      fontFamily: "Inter",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "100%",
      opacity: "0.35",
      margin: "0",
    }),
  };

  const colorToClass = {
    GREEN: classes.GREEN,
    BLUE: classes.BLUE,
    RED: classes.RED,
    YELLOW: classes.YELLOW,
    GREY: classes.GREY,
    ORANGE: classes.ORANGE,
    BLACK: classes.BLACK,
  };

  const timeOptions = getTimeOptions(restaurant);

  return (
    <>
      {props.tours.length > 0 ? (
        <div>
          {props.tours.map((tour: any) => (
            <div key={tour.id}>{tour.tourName}</div>
          ))}
        </div>
      ) : null}
      <div
        className={`${classes.TableItem} ${colorToClass[props.color] || ""}`}
      >
        <input
          className={classes.TourName}
          placeholder="Enter title"
          value={props.tourName || ""}
          onChange={(event) => props.tourNameChange(event)}
        ></input>
        <div className={classes.TourSelectGroup}>
          <span className={classes.SelectGroupLine}></span>
          <div style={{ minWidth: "46%" }}>
            {spaceNameOptions.length > 0 ? (
              <CustomSelect
                value={spaceNameOption?.value}
                onChange={props.spaneNameChange}
                options={spaceNameOptions}
                styles={customStyles}
                placeholder="Select space"
              />
            ) : (
              <button
                className={classes.ButtonToCreateSpace}
                onClick={(event) => {
                  event.preventDefault(); // Prevent the default behavior
                  if (props.handleCreateSpace) {
                    props.handleCreateSpace();
                  }
                }}
              >
                <span className={classes.LinkToCreateSpace}>
                  Create a space
                </span>
              </button>
            )}
          </div>
          <span className={classes.SelectGroupLine}></span>
          <div style={{ minWidth: "27%" }}>
            <CustomSelect
              value={dayjs(props.startTime, "HH:mm").format("HH:mm")}
              onChange={props.startTimeChange}
              options={timeOptions}
              styles={timeStyles}
              placeholder="From"
            />
          </div>
          <span className={classes.SelectGroupLine}></span>
          <div style={{ minWidth: "27%" }}>
            <CustomSelect
              value={dayjs(props.endTime, "HH:mm").format("HH:mm")}
              onChange={props.endTimeChange}
              options={timeOptions}
              styles={timeStyles}
              placeholder="Until"
            />
          </div>
        </div>
        <span className={classes.SelectGroupLine}></span>
        <div className={classes.TableActions}>
          <button className={classes.DeleteButton} onClick={props.onClose}>
            {deleteIcon}
          </button>
        </div>
      </div>
    </>
  );
};
export default EditEmployeeTour;
