import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import styles from "./AddModal.module.css";
import "react-toastify/dist/ReactToastify.css";
import { createTable, getSpaceById } from "src/auth/api/requests";
import Select from "react-select";
import SpaceSelect from "./spaceDuration/spaceSelectDuration";
import {
  closeIcon,
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
  rectangle7Table,
  square5Table,
  square8Table,
  rectangle10Table,
  rectangle12Table,
  oneSingle,
  oneBunkBed,
  oneDouble,
} from "src/icons/icons";
import Input from "src/UI/Input";
import SimpleSelect from "src/UI/SimpleSelect";
import { defaultStyle } from "src/UI/selectStyles";
import { toast } from "react-toastify";

type InviteModalProps = {
  onClose: () => void;
  selectedSpaceId?: string;
  placeType: string;
};

const InviteModal: React.FC<InviteModalProps> = ({
  onClose,
  selectedSpaceId,
  placeType,
}) => {
  const [tableName, setTableName] = useState<string>("");
  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const [spaceId, setSpaceId] = useState<string>(""); // Initialize spaceId state
  // const [spaceId, setSpaceId] = useState<string>(selectedSpaceId || ""); // Provide a default value when selectedSpaceId is undefined

  const defaultValue = { value: "0", label: "0" };
  const [selectedValue, setSelectedValue] = useState<number>(
    parseInt(defaultValue.value)
  );
  // const [selectedTable, setSelectedTable] = useState<any>(
  // getTableOptionsForSeats(selectedValue)[0]
  // getRoomOptionsForSeats(selectedValue)[0]
  // );
  const [selectedTable, setSelectedTable] = useState<any>(
    placeType === "HOTEL"
      ? getRoomOptionsForSeats(selectedValue)[0]
      : getTableOptionsForSeats(selectedValue)[0]
  );
  const [selectedTableDetails, setSelectedTableDetails] = useState();
  const [selectTableVisible, setSelectTableVisible] = useState(false);
  // const [tableOptions, setTableOptions] = useState([
  // ...getTableOptionsForSeats(selectedValue),
  //   ...getRoomOptionsForSeats(selectedValue),
  // ]);
  const [tableOptions, setTableOptions] = useState(
    placeType === "HOTEL"
      ? getRoomOptionsForSeats(selectedValue)
      : getTableOptionsForSeats(selectedValue)
  );
  const [spaceIdData, setSpaceIdData] = useState("");
  function callbackFunction(spaceId) {
    setSpaceIdData(spaceId);
  }

  // const options = [
  //   { value: "2", label: "2" },
  //   { value: "3", label: "3" },
  //   { value: "4", label: "4" },
  //   { value: "5", label: "5" },
  //   { value: "6", label: "6" },
  //   { value: "7", label: "7" },
  //   { value: "8", label: "8" },
  //   { value: "10", label: "10" },
  //   { value: "12", label: "12" },
  // ];
  const options = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
  ];
  const handleTableName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(event.target.value);
  };
  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        if (spaceId) {
          const spaceData = await getSpaceById(spaceId);

          setSpaceIdData(spaceData);
        }
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };

    fetchSpaceData();
  }, [spaceId]);

  useEffect(() => {
    if (
      selectedSpaceId &&
      tableName.length !== 0 &&
      selectedValue !== 0 &&
      selectedTable
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [selectedSpaceId, tableName, selectedValue, selectedTable]);

  function getTableSvg(
    shape:
      | "RECTANGLE"
      | "SQUARE"
      | "ROUND"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_SQUARE"
      | "BIG_ROUND",
    seats: number
  ) {
    if (seats == 2) {
      if (shape === "ROUND") {
        return round2Table;
      }
      if (shape === "SQUARE") {
        return square2Table;
      }
    }
    if (seats == 3) {
      if (shape == "ROUND") {
        return round3Table;
      }
      if (shape === "SQUARE") {
        return square3Table;
      }
    }
    if (seats == 4) {
      if (shape === "BIG_ROUND") {
        return round4Table;
      }
      if (shape === "BIG_SQUARE") {
        return square4Table;
      }
      if (shape === "RECTANGLE") {
        return rectangle4Table;
      }
      if (shape === "SMALL_SQUARE") {
        return small4SquareTable;
      }
      if (shape === "SMALL_ROUND") {
        return small4RoundTable;
      }
    }
    if (seats == 5) {
      if (shape === "SQUARE") {
        return square5Table;
      }
    }
    if (seats == 6) {
      if (shape === "BIG_ROUND") {
        return round6Table;
      }
      if (shape === "BIG_SQUARE") {
        return square6Table;
      }
      if (shape === "RECTANGLE") {
        return rectangle6Table;
      }
    }
    if (seats == 7) {
      if (shape === "RECTANGLE") {
        return rectangle7Table;
      }
    }
    if (seats == 8) {
      if (shape === "BIG_ROUND") {
        return round8Table;
      }
      if (shape === "BIG_SQUARE") {
        return square8Table;
      }
      if (shape === "RECTANGLE") {
        return rectangle8Table;
      }
    }
    if (seats == 10) {
      if (shape === "RECTANGLE") {
        return rectangle10Table;
      }
    }
    if (seats == 12) {
      if (shape === "RECTANGLE") {
        return rectangle12Table;
      }
    }
  }
  function getRoomSvg(
    shape:
      | "RECTANGLE"
      | "SQUARE"
      | "ROUND"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_SQUARE"
      | "BIG_ROUND",
    seats: number
  ) {
    if (seats == 2) {
      if (shape === "SMALL_SQUARE") {
        return oneBunkBed;
      }
      if (shape === "SQUARE") {
        return oneDouble;
      }
    }
    if (seats == 1) {
      if (shape == "SMALL_SQUARE") {
        return oneSingle;
      }
    }
  }
  function getTableOptionsForSeats(seats: number) {
    const isSixSeats = seats == 6;
    return [
      {
        id: "table1",
        name: "Table 1",
        imageUrl: getTableSvg("RECTANGLE", seats),
        seats: seats,
        shape: "RECTANGLE",
        does_not_exist: seats == 2 || seats == 3 || seats == 5, //these tables dont exist in this shape
      },
      {
        id: "table2",
        name: "Table 2",
        imageUrl: getTableSvg("SQUARE", seats),
        seats: seats,
        shape: "SQUARE",
        does_not_exist:
          seats == 4 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
      },
      {
        id: "table3",
        name: "Table 3",
        imageUrl: getTableSvg("ROUND", seats),
        seats: seats,
        shape: "ROUND",
        does_not_exist:
          seats == 4 ||
          seats == 5 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
      },
      {
        id: "table4",
        name: "Table 4",
        imageUrl: getTableSvg("SMALL_SQUARE", seats),
        seats: seats,
        shape: "SMALL_SQUARE",
        isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      {
        id: "table5",
        name: "Table 5",
        imageUrl: getTableSvg("SMALL_ROUND", seats),
        seats: seats,
        shape: "SMALL_ROUND",
        // isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      {
        id: "table6",
        name: "Table 6",
        imageUrl: getTableSvg("BIG_ROUND", seats),
        seats: seats,
        shape: "BIG_ROUND",
        // isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 7 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      {
        id: "table7",
        name: "Table 7",
        imageUrl: getTableSvg("BIG_SQUARE", seats),
        seats: seats,
        shape: "BIG_SQUARE",
        // isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 7 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      // Add more table options with their respective images
    ];
  }
  function getRoomOptionsForSeats(seats: number) {
    const isSixSeats = seats == 6;
    return [
      {
        id: "Room1",
        name: " Room 1",
        imageUrl: getRoomSvg("SMALL_SQUARE", seats),
        seats: seats,
        isSafeSpace: isSixSeats,
        shape: "SMALL_SQUARE",
        does_not_exist: seats == 0, //these tables dont exist in this shape
      },
      {
        id: "Room2",
        name: "Room 2",
        imageUrl: getRoomSvg("SQUARE", seats),
        seats: seats,
        shape: "SQUARE",
        does_not_exist: seats == 1,
      },
      // Add more table options with their respective images
    ];
  }

  const handleSeatSelect = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setSelectedValue(selectedOption.value);
      setSelectTableVisible(true);
      // let allTableOptions = getTableOptionsForSeats(selectedOption.value);
      // let allTableOptions = getRoomOptionsForSeats(selectedOption.value);
      let allTableOptions =
        placeType === "HOTEL"
          ? getRoomOptionsForSeats(selectedOption.value)
          : getTableOptionsForSeats(selectedOption.value);
      let availableTableOptions = allTableOptions.filter((table) => {
        if (!table.does_not_exist) {
          return table;
        }
      });
      setTableOptions([...availableTableOptions]);
      setSelectedTable(availableTableOptions[0]);
    } else {
      setSelectedValue(4); // Replace 0 with the default value you want when no option is selected
      setTableOptions([]); // Clear the tableOptions when no option is selected
      setSelectTableVisible(false);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };
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

  const handleSubmit = () => {
    try {
      createTable(selectedSpaceId || "", {
        tableName: tableName,
        seats: selectedTable.seats,
        shape: selectedTable.shape,
        xCoordinates: 0,
        yCoordinates: 0,
      }).then((res) => {
        placeType === "HOTEL"
          ? notifySuccess("Room created!")
          : notifySuccess("Table created!");
        setTimeout(() => {
          window.location.reload();
        }, 700);
        onClose();
      });
    } catch (err: any) {
      placeType === "HOTEL"
        ? notifyError("Error creating room!")
        : notifyError("Error creating table!");
    }
  };
  return (
    <>
      <Box className={styles.overlayInvite} />
      <Box className={styles.InviteModalWindow}>
        <div className={styles.headingInvite}>
          <p className={styles.headingInviteTitle}>
            {placeType === "HOTEL" ? "Create New Room" : "Create New Table"}
          </p>
          <button className={styles.headingInviteCloseBtn} onClick={onClose}>
            {closeIcon}
          </button>
        </div>
        <form className={styles.formInvite}>
          <div
            className="container"
            style={{
              maxHeight: "317px",
              // overflow: "hidden",
              // overflowY: "scroll",
            }}
          >
            <div className="row">
              <div className="col-md-6">
                <Input
                  placeholder={`Enter ${
                    placeType === "HOTEL" ? "Room" : "Table"
                  } ID`}
                  type="text"
                  label="ID"
                  value={tableName}
                  onChange={handleTableName}
                />
              </div>
              <div className={`${styles.select} col-md-6`}>
                <p className={styles.label}>Seats</p>
                <SimpleSelect
                  styles={defaultStyle}
                  options={options}
                  placeholder="How many seats"
                  id="seats"
                  name="seats"
                  onChange={handleSeatSelect}
                />
              </div>
              <div
                className={`${
                  selectTableVisible ? "" : styles.display_none
                } col-md-12 mb-3 `}
              >
                <p className={styles.label}>
                  Choose Your
                  {placeType === "HOTEL"
                    ? "Create Room Type"
                    : "Create Table Shape"}
                </p>
                <div className="d-flex flex-wrap">
                  {tableOptions.map((table) => (
                    <div
                      key={table.id}
                      className={`form-check table-container  ${
                        selectedTable.id === table.id ? "selected" : ""
                      }`}
                      onClick={() => handleTableSelect(table)}
                    >
                      <input
                        type="radio"
                        id={table.id}
                        name="tableOption"
                        value={table.name}
                        className="form-check-input"
                        style={{ display: "none" }}
                      />
                      {table.isSafeSpace ? (
                        <div
                          className={`table-image`}
                          style={{
                            width: "105px",
                            marginLeft: "-20px",
                            height: "80px",
                            background: "white", // White background for safe space
                            borderRadius: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        ></div>
                      ) : (
                        <label
                          htmlFor={table.id}
                          className="form-check-label"
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            className={`${styles.table_card} table-image`}
                            style={{
                              width: "105px",
                              marginLeft: "-20px",
                              height: "80px",
                              border:
                                selectedTable.id === table.id
                                  ? "2px solid var(--brand-sun, #FE9800)"
                                  : "1px solid #EEE",
                              background:
                                selectedTable.id === table.id
                                  ? "rgba(254, 152, 0, 0.04)"
                                  : "var(--brand-snow, #FFF)",
                              borderRadius: "15px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            {/* <img
                              style={{
                                width: "50px",
                                height: "50px",
                              }}
                              src={
                                typeof table.imageUrl === "string"
                                  ? table.imageUrl
                                  : ""
                              }
                              alt={table.name}
                            /> */}
                            {table.imageUrl}
                          </div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-12">
                {/* <SpaceSelect callback={callbackFunction} /> */}
              </div>
            </div>
          </div>
          <div className={styles.InviteModalAction}>
            <Button
              className={styles.InviteModalSubmitButton}
              // type="submit"
              variant="outlined"
              size="large"
              disabled={!formIsValid}
              onClick={() => handleSubmit()}
            >
              <Typography className={styles.InviteModalSubmitButtonTitle}>
                {placeType === "HOTEL" ? "Create Room" : "Create Table"}
              </Typography>
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default InviteModal;
