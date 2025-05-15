import React, { useEffect, useState } from "react";

import { Col, Row } from "react-bootstrap";
import classes from "./NewSpaceForm.module.css";
import Input from "src/UI/Input";
import {
  infoIcon,
  minusIcon,
  plusIcon,
  rectangle4Table,
  rectangle6Table,
  rectangle8Table,
  round2Table,
  round3Table,
  round4Table,
  round6Table,
  round8Table,
  small4RoundTable,
  small4SquareTable,
  square2Table,
  square3Table,
  square4Table,
  square6Table,
  square5Table,
  rectangle7Table,
  square8Table,
  rectangle10Table,
  rectangle12Table,
  oneSingle,
  oneBunkBed,
  oneDouble,
} from "src/icons/icons";
import Button from "src/UI/Button";
import useInput from "src/hooks/use-input";
import { createSpace, createTable, getSpaces } from "src/auth/api/requests";
import { toast } from "react-toastify";
import { Restaurant } from "src/Types";
import _debounce from "lodash/debounce";

const allTables = [
  {
    id: "square2Table",
    tableIcon: square2Table,
    shape: "SQUARE",
    seats: 2,
    quantity: 0,
  },
  {
    id: "round2Table",
    tableIcon: round2Table,
    shape: "ROUND",
    seats: 2,
    quantity: 0,
  },
  {
    id: "square3Table",
    tableIcon: square3Table,
    shape: "SQUARE",
    seats: 3,
    quantity: 0,
  },
  {
    id: "round3Table",
    tableIcon: round3Table,
    shape: "ROUND",
    seats: 3,
    quantity: 0,
  },
  {
    id: "small4RoundTable",
    tableIcon: small4RoundTable,
    shape: "SMALL_ROUND",
    seats: 4,
    quantity: 0,
  },
  {
    id: "small4SquareTable",
    tableIcon: small4SquareTable,
    shape: "SMALL_SQUARE",
    seats: 4,
    quantity: 0,
  },
  {
    id: "square4Table",
    tableIcon: square4Table,
    shape: "BIG_SQUARE",
    seats: 4,
    quantity: 0,
  },
  {
    id: "rectangle4Table",
    tableIcon: rectangle4Table,
    shape: "RECTANGLE",
    seats: 4,
    quantity: 0,
  },
  {
    id: "round4Table",
    tableIcon: round4Table,
    shape: "BIG_ROUND",
    seats: 4,
    quantity: 0,
  },
  {
    id: "square5Table",
    tableIcon: square5Table,
    shape: "SQUARE",
    seats: 5,
    quantity: 0,
  },
  {
    id: "square6Table",
    tableIcon: square6Table,
    shape: "BIG_SQUARE",
    seats: 6,
    quantity: 0,
  },
  {
    id: "rectangle6Table",
    tableIcon: rectangle6Table,
    shape: "RECTANGLE",
    seats: 6,
    quantity: 0,
  },
  {
    id: "round6Table",
    tableIcon: round6Table,
    shape: "BIG_ROUND",
    seats: 6,
    quantity: 0,
  },
  {
    id: "rectangle7Table",
    tableIcon: rectangle7Table,
    shape: "RECTANGLE",
    seats: 7,
    quantity: 0,
  },
  {
    id: "square8Table",
    tableIcon: square8Table,
    shape: "BIG_SQUARE",
    seats: 8,
    quantity: 0,
  },
  {
    id: "rectangle8Table",
    tableIcon: rectangle8Table,
    shape: "RECTANGLE",
    seats: 8,
    quantity: 0,
  },
  {
    id: "round8Table",
    tableIcon: round8Table,
    shape: "BIG_ROUND",
    seats: 8,
    quantity: 0,
  },
  {
    id: "rectangle10Table",
    tableIcon: rectangle10Table,
    shape: "RECTANGLE",
    seats: 10,
    quantity: 0,
  },
  {
    id: "rectangle12Table",
    tableIcon: rectangle12Table,
    shape: "RECTANGLE",
    seats: 12,
    quantity: 0,
  },
];
const allRooms = [
  {
    id: "squareDoubleBed",
    tableIcon: oneDouble,
    shape: "SQUARE",
    seats: 2,
    quantity: 0,
  },
  {
    id: "squareSingleBed",
    tableIcon: oneSingle,
    shape: "SMALL_SQUARE",
    seats: 1,
    quantity: 0,
  },
  {
    id: "squareBunkBed",
    tableIcon: oneBunkBed,
    shape: "SMALL_SQUARE",
    seats: 2,
    quantity: 0,
  },
];
const NewSpaceForm = (props: any) => {
  const [spaceName, setSpaceName] = useState<string>("");
  const [formIsInvalid, setFormIsInvalid] = useState<boolean>(true);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [spaceNameExists, setSpaceNameExists] = useState<boolean>(false);
  const [isTableSelected, setIsTableSelected] = useState<boolean>(false);
  const [enteredDuration, setEnteredDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const isNotEmpty = (value: string) => value.trim() !== "";

  const {
    value: enteredSpaceName,
    hasError: spaceNameInputHasError,
    // isValid: enteredSpaceNameIsValid,
    valueChangeHandler: spaceNameChangedHandler,
    inputBlurHandler: spaceNameBlurHandler,
    // saveEnteredValue: saveSpaceNameEnteredValue,
    reset: resetSpaceName,
  } = useInput(isNotEmpty, "");

  const handleMinusClick = () => {
    if (selectedHours === 0 && selectedMinutes === 0) return;
    if (selectedHours === 0 && selectedMinutes === 15) return;

    if (selectedMinutes > 0) {
      setEnteredDuration(selectedHours * 60 + selectedMinutes - 15);
      setSelectedMinutes(selectedMinutes - 15);
    } else if (selectedHours > 0) {
      setEnteredDuration((selectedHours - 1) * 60 + 45);
      setSelectedHours(selectedHours - 1);
      setSelectedMinutes(45);
    }
  };

  const handlePlusClick = () => {
    if (selectedHours === 6 && selectedMinutes === 0) return;
    if (selectedMinutes < 45) {
      setEnteredDuration(selectedHours * 60 + selectedMinutes + 15);
      setSelectedMinutes(selectedMinutes + 15);
    } else if (selectedHours < 6) {
      setEnteredDuration((selectedHours + 1) * 60);
      setSelectedHours(selectedHours + 1);
      setSelectedMinutes(0);
    }
  };

  // const [tablesOptions, setTablesOptions] = useState(allTables);
  // const [tablesOptions, setTablesOptions] = useState(allRooms);
  const [tablesOptions, setTablesOptions] = useState(
    props.placeType === "HOTEL" ? allRooms : allTables
  );
  const handleTableMinusClick = (id: string) => {
    let copy = tablesOptions.slice();
    copy.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity-- };
      }
    });
    setTablesOptions(copy);
  };

  const handleTablePlusClick = (id: string) => {
    let copy = tablesOptions.slice();
    copy.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity++ };
      }
    });
    setTablesOptions(copy);
  };
  useEffect(() => {
    const totalSelectedTables = tablesOptions.reduce(
      (accumulator, table) => accumulator + table.quantity,
      0
    );

    setIsTableSelected(totalSelectedTables > 0);
  }, [tablesOptions]);
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const selectedRestaurant = storedRestaurant;

    const checkSpaceNameExists = async () => {
      const spaces = await getSpaces(selectedRestaurant?.id);
      if (enteredSpaceName.trim() !== "") {
        try {
          const spaceExists = spaces.some(
            (space) =>
              space.name.toLowerCase() === enteredSpaceName.toLowerCase()
          );
          setSpaceNameExists(spaceExists);
        } catch (error) {
          console.error("Error checking if space name exists:", error);
        }
      }
    };

    const debouncedCheckSpaceNameExists = _debounce(checkSpaceNameExists, 1500); // Adjust the delay as needed

    debouncedCheckSpaceNameExists();

    return () => {
      debouncedCheckSpaceNameExists.cancel();
    };
  }, [enteredSpaceName]);

  useEffect(() => {
    if (enteredSpaceName.length === 0 || spaceNameExists || !isTableSelected) {
      setFormIsInvalid(true);
    } else {
      setFormIsInvalid(false);
    }
  }, [enteredSpaceName, spaceNameExists, isTableSelected]);

  const errorMessage = spaceNameExists ? "Space name already exists." : "";

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyError = (errorMessage: string) =>
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      setSelectedRestaurant(selectedRestaurantFromCookie);
    }
  }, []);
  const submitForm = () => {
    if (!formIsInvalid && selectedRestaurant !== undefined) {
      setLoading(true);
      createSpace(selectedRestaurant.placeId, selectedRestaurant.id, {
        name: enteredSpaceName,
        duration: enteredDuration,
      }).then((createdSpace) => {
        let tableNr = 0;
        let tableNrForName = 0;
        let initials = createdSpace.name.trim();
        if (initials.indexOf(" ") === -1) {
          // If only one word was typed, capitalize the first letter
          initials = initials.charAt(0).toUpperCase() + initials.slice(1);
        } else {
          // If multiple words were typed, generate initials
          initials = initials
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join("");
        }
        notifySuccess("Space created");
        let totalTables = tablesOptions.reduce((accumulator, table) => {
          return accumulator + table.quantity;
        }, 0);
        tablesOptions.map((table) => {
          if (table.quantity > 0) {
            for (let i = 0; i < table.quantity; i++) {
              createTable(createdSpace.id, {
                tableName: `${initials}${
                  tableNrForName < 10 ? `0${tableNrForName}` : tableNrForName
                }`,
                seats: table.seats,
                shape: table.shape,
                xCoordinates: 0,
                yCoordinates: 0,
              })
                .then((createTable) => {
                  tableNr++;
                  if (tableNr === totalTables) {
                    props.placeType === "HOTEL"
                      ? notifySuccess(`Created ${totalTables} rooms`)
                      : notifySuccess(`Created ${totalTables} tables`);

                    setTimeout(() => {
                      setLoading(false);
                      window.location.reload();
                    }, 700);
                    // if (props.onClose) {
                    //   props.onClose();
                    // }
                  }
                })
                .catch((err) => {
                  props.placeType === "HOTEL"
                    ? notifyError("Error creating room!")
                    : notifyError("Error creating table!");
                  setLoading(false);
                });
              tableNrForName++;
            }
          }
        });
      });
    }
  };

  return (
    <div className={classes.new_space_form}>
      <Row>
        <Col xs={12} lg={6}>
          <Input
            label="Space name"
            value={enteredSpaceName}
            errorMessage=""
            hasError={false}
            type="text"
            onChange={spaceNameChangedHandler}
            onBlur={spaceNameBlurHandler}
            placeholder="Enter space name"
          />
          {errorMessage && (
            <div className={classes.errorMessage}>{errorMessage}</div>
          )}
        </Col>
        <Col xs={12} lg={6}>
          <div className={classes.duration_label}>
            <p>
              <span>Duration </span>
              <i
                title="This will be the default duration of the
                reservation for this space in the app"
              >
                {infoIcon}
              </i>
            </p>
          </div>
          <div className={classes.duration_picker}>
            <button
              className={classes.duration_picker_button}
              style={{ background: "none", color: "#000" }}
              onClick={handleMinusClick}
            >
              {minusIcon}
            </button>
            <input
              className={classes.duration_input}
              type="text"
              id="duration"
              name="duration"
              value={`${selectedHours !== 0 ? selectedHours + "h" : ""} ${
                selectedMinutes !== 0 ? selectedMinutes + "min" : ""
              }`}
              readOnly
              style={{
                border: "none",
                width: "100px",
                textAlign: "center",
              }}
            />
            <button
              className={classes.duration_picker_button}
              style={{ background: "none", color: "#000" }}
              onClick={handlePlusClick}
            >
              {plusIcon}
            </button>
          </div>
        </Col>
      </Row>
      <div className={classes.tables_options_container}>
        <div className={classes.duration_label}>
          <p>
            <span> {props.placeType === "HOTEL" ? "Rooms" : "Tables"} </span>
          </p>
        </div>

        <Row style={{ margin: "0px", marginBottom: "15px" }}>
          {tablesOptions.map((tableOption) => {
            return (
              <div className={classes.table_option}>
                <div
                  className={`${classes.table_icon} ${
                    tableOption.quantity === 0 ? classes.disabled : ""
                  }`}
                >
                  {tableOption.tableIcon}
                </div>
                <div className={classes.table_input}>
                  <div
                    className={`${classes.minus} ${
                      tableOption.quantity === 0 ? classes.disabled : ""
                    }`}
                    onClick={() => handleTableMinusClick(tableOption.id)}
                  >
                    {minusIcon}
                  </div>
                  <div className={classes.quantity}>{tableOption.quantity}</div>
                  <div
                    className={classes.plus}
                    onClick={() => handleTablePlusClick(tableOption.id)}
                  >
                    {plusIcon}
                  </div>
                </div>
              </div>
            );
          })}
        </Row>
        <Row style={{ margin: "0px" }}>
          <Button
            text={loading ? "Saving..." : "Save Space"}
            onClick={submitForm}
            disabled={formIsInvalid || loading}
          />
        </Row>
      </div>
    </div>
  );
};
export default NewSpaceForm;
