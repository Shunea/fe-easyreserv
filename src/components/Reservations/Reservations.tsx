import React, { useEffect, useState } from "react";
import classes from "./Reservations.module.css";
import Title from "../Title";
import { Col, Row } from "react-bootstrap";
import SimpleSelect from "src/UI/SimpleSelect";
import { reservationStyle } from "src/UI/selectStyles";
import {
  arrowLeftIcon,
  arrowRightIcon,
  bathroomSpace,
  checkedIcon,
  cuttleryIcon,
  exitElement,
  exitHorizontalElement,
  leftArrowIcon,
  mealsIcon,
  mediumPlayground,
  moneyIcon,
  placeIcon,
  receptionBar,
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
  square4Table,
  square6Table,
  square8Table,
  stairsDown,
  stairsUp,
  windowCell,
  windowCellHorizontal,
  dishonoredIcon,
  serveIcon,
  canceledIcon,
  rejectedIcon,
  pendingIcon,
  square3Table,
  rectangle7Table,
  square5Table,
  rectangle10Table,
  rectangle12Table,
  oneDouble,
  oneBunkBed,
  oneSingle,
} from "src/icons/icons";

import { RestaurantItem, StoreType, Table } from "src/Types";
import moment from "moment";
import ReservationSchedule from "./ReservationSchedule";
import { useDispatch, useSelector } from "react-redux";
import { reservationShowComponentActions } from "src/store/reservationShowComponent";
import ReservationDetails from "./ReservationDetails";
import {
  getAllAboutPlaceById,
  getSpaceItemsBySpace,
  getSpaces,
  getTablesBySpaceReservation,
} from "src/auth/api/requests";
import Spinner from "../Spinner";
import { Restaurant } from "./../../Types";

const Reservations = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(`Create a business`);
  const [subtitle, setSubtitle] = useState(`to view your tables`);
  const [showStatus, setShowStatus] = useState<
    "closed" | "closing_soon" | "open" | undefined
  >(undefined);
  const [spacesOptions, setSpaceOptions] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [enteredSpace, setEnteredSpace] = useState(spacesOptions[0]);
  const [ItemPlaceType, setItemsPlaceType] = useState<any>({});
  const handleSelectChange = (selected: any) => {
    setEnteredSpace(selected);
    if (reservationShowComponent === "details") {
      dispatch(reservationShowComponentActions.showSchedule());
    }
    fetchTables(selected.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const storedRestaurant = JSON.parse(
        localStorage.getItem("selectedRestaurant") ?? "null"
      );
      if (storedRestaurant) {
        const selectedRestaurantFromCookie = storedRestaurant;
        setSelectedRestaurant(selectedRestaurantFromCookie);
        if (selectedRestaurantFromCookie !== undefined) {
          setTitle(selectedRestaurantFromCookie.name);
          setSubtitle(selectedRestaurantFromCookie.address);
          setShowStatus("open");
        }
        try {
          // Fetching all about the place asynchronously
          const placeInfo = await getAllAboutPlaceById(
            selectedRestaurantFromCookie.placeId
          );
          const placeType = placeInfo[0].placeType;
          setItemsPlaceType(placeType);
          getSpaces(selectedRestaurantFromCookie.id)
            .then((res) => {
              if (res.length != 0) {
                let spacesWithLabel = res.map((item) => {
                  return { label: item.name, value: item.id };
                });
                setSpaceOptions(spacesWithLabel);
                setEnteredSpace(spacesWithLabel[0]);
                fetchTables(spacesWithLabel[0].value);
              }
            })
            .catch((err) => {
              console.error(`Error getting spaces ${err}`);
            });
        } catch (error) {
          console.error(`Error getting all about place ${error}`);
        }
      }
    };
    fetchData();
    setTimeout(setLoading.bind(null, false), 500);
  }, []);

  const [tables, setTables] = useState<Table[]>([
    {
      id: "",
      createdAt: "",
      updatedAt: "",
      tableName: "",
      seats: 0,
      shape: "",
      spaceId: "",
      rotationAngle: 0,
      reservations: [],
    },
  ]);
  const [items, setItems] = useState<RestaurantItem[]>([]);

  const [tablesOnTheGrid, setTablesOnTheGrid] = useState<Table[]>([]);
  const [restaurantItemsOnTheGrid, setRestaurantItemsOnTheGrid] = useState<
    RestaurantItem[]
  >([]);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  const fetchTables = (id: string) => {
    getTablesBySpaceReservation(id, currentDate.format("YYYY-MM-DD"))
      .then((res) => {
        let fetchedTablesWithCoordinates = res.filter(
          (table) => table.xCoordinates !== 0 && table.yCoordinates !== 0
        );
        setTables(fetchedTablesWithCoordinates);
        setSelectedTable(fetchedTablesWithCoordinates[0]);

        //84 max width 70 height of a table
        let numberOfTables = res.length;
        let calculatedWidth = Math.round(84 * Math.sqrt(numberOfTables)) + 620;
        let calculatedHeight = Math.round(74 * Math.sqrt(numberOfTables)) + 200;
        if (calculatedHeight < 500) {
          //this will exceed after 29 tables
          calculatedHeight = 500;
        }
        if (calculatedWidth < 900) {
          //this will exceed after 35 tables
          calculatedWidth = 900;
        }
        setGridHeight(calculatedHeight);
        setGridWidth(calculatedWidth);
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        fetchItems(id);
      });
  };

  const fetchItems = (id: string) => {
    getSpaceItemsBySpace(id)
      .then((res) => {
        setRestaurantItemsOnTheGrid(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const itemsList = (
    <>
      {restaurantItemsOnTheGrid.map((item) => {
        return (
          <div
            style={{
              position: "absolute",
              transform: `translate(${item.xCoordinates}px, ${item.yCoordinates}px)`,
              marginLeft: `${
                item.itemType === "EXIT_VERTICAL" ||
                item.itemType === "WINDOW_VERTICAL"
                  ? "-6px"
                  : ""
              }`,
              marginTop: `${
                item.itemType === "EXIT_HORIZONTAL" ||
                item.itemType === "WINDOW_HORIZONTAL"
                  ? "-6px"
                  : ""
              }`,
            }}
            className={classes.restaurant_item}
          >
            {item.itemType === "BATHROOM" ? bathroomSpace : ""}
            {item.itemType === "STAIRS_UP" ? stairsUp : ""}
            {item.itemType === "STAIRS_DOWN" ? stairsDown : ""}
            {item.itemType === "EXIT_VERTICAL" ? exitElement : ""}
            {item.itemType === "EXIT_HORIZONTAL" ? exitHorizontalElement : ""}
            {item.itemType === "WINDOW_VERTICAL" ? windowCell : ""}
            {item.itemType === "WINDOW_HORIZONTAL" ? windowCellHorizontal : ""}
            {item.itemType === "RECEPTION_BAR" ? receptionBar : ""}
            {item.itemType === "PLAYGROUND" ? mediumPlayground : ""}
          </div>
        );
      })}
    </>
  );

  const [selectedTable, setSelectedTable] = useState(tables[0]);

  const reservationShowComponent = useSelector(
    (state: StoreType) => state.reservationShowComponent.component
  );
  const clickedReservation = useSelector(
    (state: StoreType) => state.reservationShowComponent.clickedReservation
  );
  const dispatch = useDispatch();
  dispatch(reservationShowComponentActions.setCurrentTable(selectedTable));

  useEffect(() => {
    dispatch(reservationShowComponentActions.setDate(moment()));
    if (selectedTable?.reservations.length !== 0) {
      //if table has reservations
      dispatch(reservationShowComponentActions.showSchedule());
    }
  }, []);

  function getTableDetails(
    shape:
      | "RECTANGLE"
      | "SQUARE"
      | "ROUND"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_SQUARE"
      | "BIG_ROUND"
      | "SMALL"
      | "",
    seats: number
  ): { svg: any; width: number; height: number } {
    if (seats == 2) {
      if (shape === "ROUND") {
        return {
          svg: round2Table,
          width: 57,
          height: 40,
        };
      }
      if (shape === "SQUARE") {
        return {
          svg: square2Table,
          width: 60,
          height: 44,
        };
      }
    }
    if (seats == 3) {
      if (shape === "ROUND") {
        return {
          svg: round3Table,
          width: 56,
          height: 50,
        };
      }
      if (shape === "SQUARE") {
        return {
          svg: square3Table,
          width: 60,
          height: 44,
        };
      }
    }
    if (seats == 4) {
      if (shape === "BIG_ROUND") {
        return {
          svg: round4Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "BIG_SQUARE") {
        return {
          svg: square4Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle4Table,
          width: 72,
          height: 58,
        };
      }
      if (shape === "SMALL_SQUARE") {
        return {
          svg: small4SquareTable,
          width: 59,
          height: 57,
        };
      }
      if (shape === "SMALL_ROUND") {
        return {
          svg: small4RoundTable,
          width: 59,
          height: 57,
        };
      }
    }
    if (seats == 5) {
      if (shape === "SQUARE") {
        return {
          svg: square5Table,
          width: 60,
          height: 44,
        };
      }
    }
    if (seats == 6) {
      if (shape === "BIG_ROUND") {
        return {
          svg: round6Table,
          width: 74,
          height: 70,
        };
      }
      if (shape === "BIG_SQUARE") {
        return {
          svg: square6Table,
          width: 73,
          height: 74,
        };
      }
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle6Table,
          width: 72,
          height: 58,
        };
      }
    }
    if (seats == 7) {
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle7Table,
          width: 73,
          height: 74,
        };
      }
    }
    if (seats == 8) {
      if (shape === "BIG_ROUND") {
        return {
          svg: round8Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "BIG_SQUARE") {
        return {
          svg: square8Table,
          width: 74,
          height: 74,
        };
      }
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle8Table,
          width: 89,
          height: 58,
        };
      }
    }
    if (seats == 10) {
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle10Table,
          width: 89,
          height: 58,
        };
      }
    }
    if (seats == 12) {
      if (shape === "RECTANGLE") {
        return {
          svg: rectangle12Table,
          width: 89,
          height: 58,
        };
      }
    }
    return {
      svg: "",
      width: 0,
      height: 0,
    };
  }
  function getRoomDetails(
    shape:
      | "RECTANGLE"
      | "ROUND"
      | "SQUARE"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_ROUND"
      | "BIG_SQUARE"
      | "SMALL"
      | "",
    seats: number
  ): { svg: any; width: number; height: number } {
    if (seats == 2) {
      if (shape === "SMALL_SQUARE") {
        return {
          svg: oneBunkBed,
          width: 59,
          height: 57,
        };
      }
      if (shape === "SQUARE") {
        return {
          svg: oneDouble,
          width: 70,
          height: 54,
        };
      }
    }

    if (seats == 1) {
      if (shape === "SMALL_SQUARE") {
        return {
          svg: oneSingle,
          width: 59,
          height: 57,
        };
      }
    }
    return {
      svg: "",
      width: 0,
      height: 0,
    };
  }

  const statusStyle = (status: string | undefined) => {
    return status === "CANCELLED"
      ? classes.canceled
      : status === "CLOSED"
      ? classes.closed
      : status === "CONFIRMED" || status === "CONFIRMED_PREORDER"
      ? classes.confirmed
      : status === "DISHONORED"
      ? classes.dishonored
      : status === "PENDING" || status === "PENDING_PREORDER"
      ? classes.pending
      : status === "SERVE" || status === "SERVE_PREORDER"
      ? classes.serve
      : status === "REJECTED"
      ? classes.rejected
      : "";
  };

  const statusIcon = (status: string | undefined) =>
    status === "PENDING" || status === "PENDING_PREORDER"
      ? pendingIcon
      : status === "CONFIRMED" || status === "CONFIRMED_PREORDER"
      ? checkedIcon
      : status === "REJECTED"
      ? rejectedIcon
      : status === "CLOSED"
      ? moneyIcon
      : status === "SERVE" || status === "SERVE_PREORDER"
      ? serveIcon
      : status === "CANCELLED"
      ? canceledIcon
      : status === "DISHONORED"
      ? dishonoredIcon
      : null;
  const selectTable = (tableId: string) => {
    const foundTable = tables.find((table) => table.id === tableId);
    if (foundTable) {
      setSelectedTable(foundTable);
      if (foundTable.reservations.length !== 0) {
        //has reservations
        dispatch(reservationShowComponentActions.showSchedule());
        dispatch(reservationShowComponentActions.setCurrentTable(foundTable));
      } else {
        dispatch(reservationShowComponentActions.showNoReservation());
      }
    }
  };

  const tablesList = tables.map((table: Table) => {
    let tableDetails =
      ItemPlaceType === "HOTEL"
        ? getRoomDetails(table.shape, table.seats)
        : getTableDetails(table.shape, table.seats);
    // const tableDetails = getTableDetails(table.shape, table.seats);
    // const tableDetails = getRoomDetails(table.shape, table.seats);
    const tableReservations = table.reservations;
    const lastReservation = table.reservations[table.reservations.length - 1];
    return (
      <div
        style={{
          position: "absolute",
          transform: `translate(${table.xCoordinates}px, ${table.yCoordinates}px) rotate(${table.rotationAngle}deg)`,
          width: `${tableDetails.width}px`,
          height: `${tableDetails.height}px`,
        }}
        className={classes.table_container}
        onClick={() => selectTable(table.id)}
      >
        {tableReservations.length !== 0 &&
          lastReservation?.guestsNumber !== 0 &&
          moment(lastReservation?.date).isSame(currentDate, "day") && (
            <div
              className={`${classes.occupied_seats} ${statusStyle(
                lastReservation?.status
              )}`}
            >
              {lastReservation?.occupiedSeats}
            </div>
          )}
        <p
          style={{ lineHeight: `${tableDetails.height}px` }}
          className={`${classes.table_id} ${
            table.reservations.length !== 0 &&
            moment(lastReservation?.date).isSame(currentDate, "day") &&
            statusStyle(lastReservation?.status)
          }`}
        >
          {" "}
          {table.tableName}
        </p>
        <div
          style={{
            width: `${tableDetails.width}px`,
            height: `${tableDetails.height}px`,
          }}
          className={`${classes.table} ${
            table.reservations.length !== 0 &&
            moment(lastReservation?.date).isSame(currentDate, "day") &&
            statusStyle(lastReservation?.status)
          }`}
        >
          {tableDetails.svg}
        </div>
        {(lastReservation?.status === "CONFIRMED_PREORDER" ||
          lastReservation?.status === "PENDING_PREORDER") &&
          moment(lastReservation?.date).isSame(currentDate, "day") && (
            <div
              className={`${classes.order_status} ${
                table.reservations.length !== 0 &&
                statusStyle(lastReservation?.status)
              }`}
            >
              {cuttleryIcon}
            </div>
          )}
      </div>
    );
  });

  const noReservations = (
    <div className={classes.reservations_no_reservations}>
      <span>{mealsIcon}</span>
      {tables[0]?.id === "" ? (
        <p>No reservations available</p>
      ) : (
        <p>No reservations available for this table</p>
      )}
    </div>
  );

  const returnToSchedule = () => {
    dispatch(reservationShowComponentActions.showSchedule());
  };
  const tableReservations = (
    <div className={classes.reservations_container}>
      <div className={classes.reservations_header}>
        <Row>
          <Col md={7} className={classes.reservations_header_reservation}>
            {tables.length === 0 && (
              <p>
                You have no{" "}
                <a
                  className={classes.no_tables_link}
                  href={"/restaurant"}
                  title="Create tables"
                >
                  tables
                </a>
                .
              </p>
            )}
            {tables.length !== 0 &&
              tables[0]?.id !== "" &&
              (reservationShowComponent === "schedule" ||
                reservationShowComponent === "no-reservation") && (
                <p>{`Reservations for ${selectedTable?.tableName}`}</p>
              )}
            {reservationShowComponent === "details" && (
              <p>
                <span onClick={returnToSchedule}>{leftArrowIcon}</span>
                Reservation
                <span
                  className={classes.header_reservation_number}
                >{` #${clickedReservation.number}`}</span>
              </p>
            )}
          </Col>
          <Col md={5} className={classes.status_col}>
            {reservationShowComponent === "details" && (
              <div>
                <span
                  className={`${classes.status} ${statusStyle(
                    clickedReservation?.status
                  )}`}
                >
                  <span className={classes.icon}>
                    {" "}
                    {statusIcon(clickedReservation?.status)}
                  </span>
                  {clickedReservation?.status.charAt(0).toUpperCase() +
                    clickedReservation?.status
                      .slice(1)
                      .toLowerCase()
                      .replaceAll("_", " ")}
                </span>
              </div>
            )}
          </Col>
        </Row>
      </div>
      <div className={classes.reservations_content}>
        {tables.length !== 0 && reservationShowComponent === "schedule" && (
          <ReservationSchedule />
        )}
        {tables.length !== 0 && reservationShowComponent === "details" && (
          <ReservationDetails currentSpace={enteredSpace} />
        )}
        {tables.length !== 0 &&
          reservationShowComponent === "no-reservation" &&
          noReservations}
        {tables.length === 0 &&
          reservationShowComponent === "no-reservation" &&
          noReservations}
      </div>
    </div>
  );

  const addDay = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(currentDate.add(1, "d").format())
    );
    setCurrentDate(date.add(1, "d"));
    if (reservationShowComponent === "details") {
      dispatch(reservationShowComponentActions.showSchedule());
    }
    console.log("aici eroare 1", enteredSpace)
    fetchTables(
      //@ts-ignore
      enteredSpace?.value
    );
  };
  const subtractDay = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(
        currentDate.subtract(1, "d").format()
      )
    );
    setCurrentDate(date.subtract(1, "d"));

    if (reservationShowComponent === "details") {
      dispatch(reservationShowComponentActions.showSchedule());
    }
    console.log("aici eroare 2", enteredSpace)
    fetchTables(
      //@ts-ignore
      enteredSpace?.value
    );
  };

  const datepicker = (
    <div className={classes.date_picker}>
      <div
        className={classes.date_picker_arrow}
        onClick={() => subtractDay(currentDate.clone())}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("DD-MMMM-YYYY")}
      </div>
      <div
        className={classes.date_picker_arrow}
        onClick={() => addDay(currentDate.clone())}
      >
        {arrowRightIcon}
      </div>
    </div>
  );
  const addMonth = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(currentDate.add(1, "M").format())
    );
    setCurrentDate(date.add(1, "M"));
    if (reservationShowComponent === "details") {
      dispatch(reservationShowComponentActions.showSchedule());
    }
    console.log("aici eroare 3", enteredSpace)
    fetchTables(
      //@ts-ignore
      enteredSpace?.value
    );
  };
  const subtractMonth = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(
        currentDate.subtract(1, "M").format()
      )
    );
    setCurrentDate(date.subtract(1, "M"));

    if (reservationShowComponent === "details") {
      dispatch(reservationShowComponentActions.showSchedule());
    }
    console.log("aici eroare 4", enteredSpace)
    fetchTables(
      //@ts-ignore
      enteredSpace?.value
    );
  };

  const monthpicker = (
    <div className={classes.date_picker}>
      <div
        className={classes.date_picker_arrow}
        onClick={() => subtractMonth(currentDate.clone())}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("MMMM-YYYY")}
      </div>
      <div
        className={classes.date_picker_arrow}
        onClick={() => addMonth(currentDate.clone())}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  return (
    <>
      {!loading ? (
        <div>
          <Row>
            <Col xs={12} lg={6}>
              <Title title={title} subtitle={subtitle} status={showStatus} />
            </Col>
            <Col>
              <Row className={classes.header_second_col}>
                <Col className={classes.header_col}>{monthpicker}</Col>
                <Col className={classes.header_col}>{datepicker}</Col>
                <Col className={classes.header_col}>
                  <span className={classes.selectIcon}>{placeIcon}</span>
                  <SimpleSelect
                    value={enteredSpace}
                    options={spacesOptions}
                    placeholder={"No spaces"}
                    onChange={handleSelectChange}
                    styles={reservationStyle}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={classes.tables_container}>
            <Col
              xs={7}
              style={{
                overflow: "scroll",
              }}
            >
              {
                <div
                  style={{
                    background: "#FCFCFC",
                    outline: "6px solid #eee",
                    width: `${gridWidth}px`,
                    height: `${gridHeight}px`,
                    borderRadius: "12px",
                    // overflow: "hidden",
                    position: "relative",
                    marginTop: "6px",
                    marginBottom: "12px",
                  }}
                >
                  <div className={classes.grid}>
                    {tables.length !== 0 && tablesList}
                    {restaurantItemsOnTheGrid.length !== 0 && itemsList}
                  </div>
                </div>
              }
            </Col>
            <Col xs={5}>{tableReservations}</Col>
          </Row>
        </div>
      ) : null}
      <Spinner loading={loading} />
    </>
  );
};
export default Reservations;
