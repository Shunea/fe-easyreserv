import React, { useEffect, useRef, useState } from "react";
import classes from "./Tables.module.css";
import plus from "../../../assets/Plus.svg";
import Grid from "../EditTable/Math_grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Dot from "../../../assets/Ellipse 2.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Title from "src/components/Title";
import {
  addSpaceItem,
  createTable,
  deleteSpaceItemById,
  deleteTable,
  getSpaceItemsBySpace,
  getSpaces,
  getTableById,
  getAllAboutPlaceById,
  getTables,
  getTablesBySpace,
  updateSpaceItem,
  updateTable,
} from "src/auth/api/requests";
// import CreateSpaces from "../Spaces/index";
import { Col, Row } from "react-bootstrap";
import SimpleSelect from "src/UI/SimpleSelect";
import { reservationStyle } from "src/UI/selectStyles";
import {
  arrowDownIcon,
  checkIcon,
  childIcon,
  deleteIcon,
  duplicateIcon,
  editIcon,
  exitIcon,
  moveIcon,
  placeIcon,
  receptionIcon,
  rotateIcon,
  seatsIcon,
  stairsIcon,
  tableIcon,
  wcIcon,
  windowIcon,
} from "src/icons/icons";
import Button from "src/UI/Button";
import AddModal from "../AddTable/AddModal";
import { RestaurantItem } from "src/Types";
import HalfPageForm from "src/UI/HalfPageForm";
import NewSpaceForm from "../Spaces/NewSpaceForm";
import { toast } from "react-toastify";
import AddTableForm from "../AddTable/AddTableForm";
import EditTableForm from "../AddTable/EditTableForm";
import EditSpaceForm from "../Spaces/EditSpaceForm";
import Spinner from "../../Spinner";
import moment from "moment";
type Table = {
  id: string;
  seats: number;
  tableName: string;
  shape: string;
  xCoordinates?: number;
  уCoordinates?: number;
  rotationAngle?: number;
};

type RestaurantTablesProps = {
  tables: Table[];
  handleTableClick: (table: Table) => void;
  placeType: string;
};
const RestaurantTables: React.FC<RestaurantTablesProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [tablesInfo, setTablesInfoData] = useState<any>(null);
  const tableBoxRef = useRef<HTMLDivElement | null>(null);
  const newTableRef = useRef<HTMLDivElement | null>(null);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [showModal, setShowModal] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const moveToRef = useRef<HTMLDivElement>(null);
  const [showCreateSpaces, setShowCreateSpaces] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [restaurantItemsOnTheGrid, setRestaurantItemsOnTheGrid] = useState<
    RestaurantItem[]
  >([]);
  const [saveTablesIsDisabled, SetSaveTablesIsDisabled] = useState(true);

  const [tables, setTables] = useState<any>([]);
  const [tablesPositions, setTablesPositions] = useState<any>({});
  const [itemsPositions, setItemsPositions] = useState<any>({});

  const [selectedRestaurant, setSelectedRestaurant] = useState();
  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      setSelectedRestaurant(selectedRestaurantFromCookie);
      if (selectedRestaurantFromCookie !== undefined) {
        setTitle(selectedRestaurantFromCookie.name);
        setSubtitle(selectedRestaurantFromCookie.address);
      }
      // Continue with the rest of your code
      getSpaces(selectedRestaurantFromCookie.id)
        .then((spaces) => {
          const formattedOptions = spaces
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((space) => ({
              value: space.id,
              label: space.name,
            }));
          setSelectedOption(formattedOptions[0]);
          setSpaceOptions(formattedOptions);
          fetchTables(formattedOptions[0].value);
        })
        .catch((err) => {
          console.error(`Error getting spaces ${err}`);
        });
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        tableBoxRef.current &&
        !tableBoxRef.current.contains(e.target as Node)
      ) {
        setShowModal(false);
        let newState = { ...modalsState };
        tables.forEach((el) => {
          newState[el.id] = { firstModal: false, secondModal: false };
        });
        setModalsState(newState);
        setShowItemsModal(false);
        SetSecondModalExit(false);
        SetSecondModalWindow(false);
        SetSecondModalStairs(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleOutsideTableClick = (e: MouseEvent) => {
      if (
        newTableRef.current &&
        !newTableRef.current.contains(e.target as Node)
      ) {
        setIsModalOpen(false);
        let newState = { ...modalsState };
        tables.forEach((el) => {
          newState[el.id] = { firstModal: false, secondModal: false };
        });
        setModalsState(newState);
      }
    };

    document.addEventListener("mousedown", handleOutsideTableClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideTableClick);
    };
  }, []);

  const handleOpenCreateSpaces = () => {
    setShowCreateSpaces(true);
  };

  const handleCloseCreateSpaces = () => {
    setShowCreateSpaces(false);
  };

  const handleEllipsisClick = () => {
    setShowModal(true);
  };

  const handleMoveToClick = () => {
    setShowMoveToModal(!showMoveToModal);
  };

  const handleRedirect = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    fetchTables(selectedOption.value);
    fetchItems(selectedOption.value);
    setTablesOnTheGrid([]);
    setTablesPositions({});
    setItemsPositions([]);
    setRestaurantItemsOnTheGrid([]);
  };

  const [title, setTitle] = useState("Create a business");
  const [subtitle, setSubtitle] = useState("to plan your restaurant");

  type Table = {
    createdAt: string;
    id: string;
    seats: number;
    shape: string;
    spaceId: string;
    tableName: string;
    updatedAt: string;
    xCoordinates?: string;
    yCoordinates?: string;
    rotationAngle?: string;
  };
  const [currentDate, setCurrentDate] = useState(moment());
  const [tablesOnTheGrid, setTablesOnTheGrid] = useState<Table[]>([]);
  const [initialTablesState, setInitialTablesState] = useState<any>([]);
  const [initialItemsState, setInitialItemsState] = useState<any>([]);
  const [initialTablesPosition, setInitialTablesPosition] = useState({});
  const [initialItemsPosition, setInitialItemsPosition] = useState({});

  const fetchTables = (id: string) => {
    getTablesBySpace(id)
      .then((res) => {
        setTables(res);
        let fetchedTablesWithCoordinates = res.filter(
          (table) => table.xCoordinates !== 0 && table.yCoordinates !== 0
        );
        let initialPositionsOfTables = {};
        fetchedTablesWithCoordinates.map((table) => {
          initialPositionsOfTables[table.id] = {
            x: table.xCoordinates,
            y: table.yCoordinates,
          };
        });
        setInitialTablesPosition(initialPositionsOfTables);
        setInitialTablesState(fetchedTablesWithCoordinates);
        setTablesOnTheGrid(fetchedTablesWithCoordinates);
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
        // setTables(res);
        // let fetchedTablesWithCoordinates = res.filter((table) =>
        //   table.xCoordinates !== 0 && table.yCoordinates !== 0
        // )
        let initialPositionsOfItems = {};
        res.map((item) => {
          initialPositionsOfItems[item.id] = {
            x: item.xCoordinates,
            y: item.yCoordinates,
          };
        });
        setInitialItemsPosition(initialPositionsOfItems);
        setInitialItemsState(res);
        setRestaurantItemsOnTheGrid(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const initialModalsState = {};

  useEffect(() => {
    tables.forEach((el) => {
      initialModalsState[el.id] = { firstModal: false, secondModal: false };
    });
    setModalsState(initialModalsState);
  }, []);
  const [modalsState, setModalsState] = useState(initialModalsState);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedRotationTableId, setSelectedRotationTableId] = useState(null);

  const openModal = (id: string) => {
    let newState = { ...modalsState };
    tables.forEach((el) => {
      newState[el.id] = { firstModal: false, secondModal: false };
    });
    newState[id].firstModal = true;
    setModalsState(newState);
  };

  const openMoveToModal = (id: string) => {
    let newState = { ...modalsState };
    newState[id].secondModal = true;
    setModalsState(newState);
  };

  const closeModal = (id: string) => {
    let newState = { ...modalsState };
    tables.forEach((el) => {
      newState[el.id] = { firstModal: false, secondModal: false };
    });
    setModalsState(newState);
  };

  const duplicateTable = (tableId) => {
    getTableById(tableId)
      .then((res: Table) => {
        createTable(selectedOption.value, {
          tableName: res.tableName + "C",
          seats: res.seats,
          shape: res.shape,
          xCoordinates: 0,
          yCoordinates: 0,
        })
          .then((res) => {
            notifySuccess("Table duplicated!");
            fetchTables(selectedOption.value);
            tablesPositions[res.id] = { x: 0, y: 0 };
            setTablesPositions(tablesPositions);
          })
          .catch((err) => {
            console.error(err);
            notifyError("Table couldn't be deleted!");
          });
      })
      .catch((err) => {
        notifyError("Table couldn't be found!");
        console.error(err);
      });
  };
  const rotateTable = (tableId) => {
    getTableById(tableId).then((res: Table) => {
      const rotationAngles = res?.rotationAngle;
      const x = tablesPositions[tableId].x;
      const y = tablesPositions[tableId].y;
      if (rotationAngles !== undefined) {
        const rotationAngleNumber = parseInt(rotationAngles);
        let newRotationAngle = rotationAngleNumber + 90;
        if (newRotationAngle > 270) {
          newRotationAngle = 0;
        }
        setRotationAngle(newRotationAngle);
        updateTablesPositionState(tableId, x, y, newRotationAngle);
      }
      // // Update the state with the new rotation angle
      let temp = somethingChanged + 1;
      setSomethingChanged(temp);
      SetSaveTablesIsDisabled(false);
      setSelectedRotationTableId(tableId);
    });
  };

  const deleteTheTable = (tableId) => {
    deleteTable(tableId)
      .then((res) => {
        notifySuccess("Table deleted!");
        fetchTables(selectedOption.value);
        tablesPositions[tableId] = { x: 0, y: 0 };
        setTablesPositions(tablesPositions);
      })
      .catch((err) => {
        notifyError("Table couldn't be deleted!");
        console.error(err);
      });
    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
  };
  const moveTableToSpace = (
    tableId: string,
    space: { value: string; label: string }
  ) => {
    updateTable(space.value, tableId, {
      spaceId: space.value,
      xCoordinates: 0,
      yCoordinates: 0,
    })
      .then(() => {
        fetchTables(selectedOption.value);
        notifySuccess(`Table moved to ${space.label}!`);
      })
      .catch((err) => {
        console.error(err);
        notifyError(`Unable to move space to ${space.label}!`);
      });
    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
  };
  useEffect(() => {
    SetSaveTablesIsDisabled(true);
  }, [
    selectedOption,
    initialItemsPosition,
    itemsPositions,
    initialTablesPosition,
    tablesPositions,
  ]);
  const TableModal = (props: { id: string }) => {
    return (
      <div
        ref={tableBoxRef}
        className={`${classes.modal_button} ${classes.modal_container}`}
        id={`firstmodal${props.id}`}
      >
        <div style={{ marginTop: "6px" }}>
          <button
            onClick={() => {
              setHalfPageForm("EDIT_TABLE");
              setTableToEdit(props.id);
            }}
          >
            <span className={classes.modal_icon}>{editIcon}</span>
            <div className={classes.modal_text}>Edit</div>
          </button>
          <button
            onClick={() => {
              duplicateTable(props.id);
            }}
          >
            <span className={classes.modal_icon}>{duplicateIcon}</span>
            <div className={classes.modal_text}>Duplicate</div>
          </button>
          <button
            onClick={() => {
              rotateTable(props.id);
            }}
          >
            <span className={classes.modal_icon}>{rotateIcon}</span>
            <div className={classes.modal_text}>Rotate</div>
          </button>
          <button onClick={() => openMoveToModal(props.id)}>
            <span className={classes.modal_icon}>{moveIcon}</span>
            <div className={classes.modal_text}>Move to</div>
            <FontAwesomeIcon icon={faChevronRight} className={classes.arrow} />
          </button>
          <button
            onClick={() => {
              deleteTheTable(props.id);
            }}
          >
            <span className={classes.modal_icon}>{deleteIcon}</span>
            <div className={classes.modal_text}>Delete</div>
          </button>
          <div>
            {modalsState[props.id]?.secondModal && (
              <div
                id={`secondmodal${props.id}`}
                ref={moveToRef}
                className={classes.second_modal}
              >
                <div>
                  {spaceOptions.map((space: any) => {
                    if (selectedOption) {
                      return (
                        <button
                          className={`${classes.second_modal_options} ${
                            selectedOption.value == space.value
                              ? classes.selected_space
                              : ""
                          } `}
                          onClick={
                            selectedOption.value === space.value
                              ? () => {}
                              : () => {
                                  moveTableToSpace(props.id, space);
                                }
                          }
                        >
                          <span className={classes.modal_icon}>
                            {placeIcon}
                          </span>
                          {space.label}
                          <span
                            className={`${classes.modal_icon} ${classes.check_icon}`}
                          >
                            {checkIcon}
                          </span>
                        </button>
                      );
                    }
                  })}
                  <button
                    // onClick={handleOpenCreateSpaces}
                    onClick={() => {
                      setHalfPageForm("ADD_SPACE");
                    }}
                    className={classes.new_space_button}
                  >
                    {" "}
                    <img
                      // style={{ marginRight: "10px" }}
                      src={plus}
                      alt="plus"
                    />{" "}
                    New Space
                  </button>
                  {/* <CreateSpaces
                    show={showCreateSpaces}
                    onHide={handleCloseCreateSpaces}
                  /> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState("");
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  const handleAddTableOpenModal = () => {
    setIsAddTableModalOpen(true);
  };
  const handleAddTableCloseModal = () => {
    setIsAddTableModalOpen(false);
    try {
      getTablesBySpace(selectedOption.value).then((res) => {
        setTables(res);
      });
    } catch (err: any) {
      console.error(err);
    }
  };
  const handleEditTableOpenModal = (id: string) => {
    setTableToEdit(id);
    setIsEditTableModalOpen(true);
  };
  const handleEditTableCloseModal = () => {
    setTableToEdit("");
    setIsEditTableModalOpen(false);
    try {
      getTablesBySpace(selectedOption.value)
        .then((res) => {
          setTables(res);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const NoTables = () => {
    return (
      <div className={classes.notables}>
        <p>No tables in this space</p>
      </div>
    );
  };

  const SecondModalForItems = (props: { modalFor: "EXIT" | "WINDOW" }) => {
    return (
      <div
        ref={moveToRef}
        className={`${classes.second_items_modal} ${classes.second_modal}`}
      >
        <div>
          <button
            className={`${classes.second_modal_options}  `}
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: `${props.modalFor}_HORIZONTAL`,
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            Horizontal
          </button>
          <button
            className={`${classes.second_modal_options}  `}
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: `${props.modalFor}_VERTICAL`,
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            Vertical
          </button>
        </div>
      </div>
    );
  };
  const [somethingChanged, setSomethingChanged] = useState(0);
  const handleAddRestaurantItemOnGrid = (itemType: RestaurantItem) => {
    let copyOfArray = restaurantItemsOnTheGrid.slice();
    copyOfArray.push(itemType);
    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
    setRestaurantItemsOnTheGrid(copyOfArray);
  };
  const handleRemoveRestaurantItemFromGrid = (itemType: RestaurantItem) => {
    let copyOfArray = restaurantItemsOnTheGrid.slice();
    copyOfArray = copyOfArray.filter((i) => {
      return i.id !== itemType.id;
    });
    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
    setRestaurantItemsOnTheGrid(copyOfArray);
    itemsPositions[itemType.id] = { x: -15, y: -15 };
    setItemsPositions(itemsPositions);
  };

  const SecondModalForItemsStairs = () => {
    return (
      <div
        ref={moveToRef}
        className={`${classes.second_items_modal} ${classes.second_modal}`}
      >
        <div>
          <button
            className={`${classes.second_modal_options}`}
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: "STAIRS_UP",
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            Stairs up
          </button>
          <button
            className={`${classes.second_modal_options}`}
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: "STAIRS_DOWN",
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            Stairs down
          </button>
        </div>
      </div>
    );
  };
  const [secondModalWindow, SetSecondModalWindow] = useState(false);
  const [secondModalStairs, SetSecondModalStairs] = useState(false);
  const [secondModalExit, SetSecondModalExit] = useState(false);

  const handleExitModal = () => {
    SetSecondModalExit((prevState) => !prevState);
    SetSecondModalWindow(false);
    SetSecondModalStairs(false);
  };

  const handleWindowModal = () => {
    SetSecondModalWindow((prevState) => !prevState);
    SetSecondModalExit(false);
    SetSecondModalStairs(false);
  };
  const handleStairsModal = () => {
    SetSecondModalStairs((prevState) => !prevState);
    SetSecondModalExit(false);
    SetSecondModalWindow(false);
  };
  const ItemsModal = () => {
    return (
      <div
        ref={tableBoxRef}
        className={`${classes.modal_button} ${classes.modal_container} ${classes.items_modal}  `}
      >
        <div style={{ marginTop: "0px" }}>
          <button
            onClick={() => {
              setHalfPageForm("ADD_TABLE");
            }}
          >
            <span className={classes.modal_icon}>{tableIcon}</span>
            <div className={`${classes.modal_text} `}>
              {props.placeType === "HOTEL" ? "Add Room" : "Add Table"}
            </div>
          </button>
          <button
            onClick={() => {
              setHalfPageForm("ADD_SPACE");
            }}
          >
            <span className={classes.modal_icon}>{placeIcon}</span>
            <div className={`${classes.modal_text} `}>Add space</div>
          </button>
          <button
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: "BATHROOM",
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            <span className={classes.modal_icon}>{wcIcon}</span>
            <div className={classes.modal_text}>Bathroom</div>
          </button>
          <button
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: "RECEPTION_BAR",
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            <span className={classes.modal_icon}>{receptionIcon}</span>
            <div className={classes.modal_text}>Reception bar</div>
          </button>
          <button
            onClick={() => {
              handleAddRestaurantItemOnGrid({
                itemType: "PLAYGROUND",
                id: `${(Math.random() + 1).toString(36).substring(6)}`,
                spaceId: selectedOption.value,
              });
            }}
          >
            <span className={classes.modal_icon}>{childIcon}</span>
            <div className={classes.modal_text}>Kids zone</div>
          </button>
          <button
            onClick={() => {
              handleExitModal();
            }}
          >
            <span className={classes.modal_icon}>{exitIcon}</span>
            <div className={classes.modal_text}>Exit door</div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`${classes.arrow} ${classes.items_arrow}`}
            />
          </button>
          {secondModalExit && <SecondModalForItems modalFor="EXIT" />}
          <button
            onClick={() => {
              handleWindowModal();
            }}
          >
            <span className={classes.modal_icon}>{windowIcon}</span>
            <div className={classes.modal_text}>Window</div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`${classes.arrow} ${classes.items_arrow}`}
            />
          </button>
          {secondModalWindow && <SecondModalForItems modalFor="WINDOW" />}
          <button
            onClick={() => {
              handleStairsModal();
            }}
          >
            <span className={classes.modal_icon}>{stairsIcon}</span>
            <div className={classes.modal_text}>Stairs</div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`${classes.arrow} ${classes.items_arrow}`}
            />
          </button>
          {secondModalStairs && <SecondModalForItemsStairs />}
        </div>
      </div>
    );
  };
  const [halfPageForm, setHalfPageForm] = useState<
    boolean | "ADD_SPACE" | "EDIT_TABLE" | "ADD_TABLE" | "EDIT_SPACE"
  >(false);

  useEffect(() => {
    if (
      halfPageForm === "ADD_SPACE" ||
      halfPageForm === "EDIT_TABLE" ||
      halfPageForm === "ADD_TABLE"
    ) {
      document.body.style.position = "sticky";
      document.body.style.overflow = "hidden";
    }
    if (halfPageForm === false) {
      document.body.style.position = "static";
      document.body.style.overflowY = "scroll";
    }
  }, [halfPageForm]);

  const closeHalfPageForm = () => {
    setHalfPageForm(false);
  };

  const openItemsModal = () => {
    setShowItemsModal(true);
  };
  const setTableOnGrid = (table: any) => {
    let arrayCopy = tablesOnTheGrid.slice();
    arrayCopy.push(table);
    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
    let arrayWithNoCopies = new Set(arrayCopy);
    setTablesOnTheGrid(Array.from(arrayWithNoCopies));
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
  const updateTablesPositionState = (
    tableId: string,
    x: number,
    y: number,
    rotationAngle: number
  ) => {
    tablesPositions[tableId] = { x: x, y: y, rotationAngle: rotationAngle }; // Save rotation angle in tablesPositions object
    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
    setTablesPositions(tablesPositions);
  };

  const updateItemsPositionState = (itemId: string, x: number, y: number) => {
    itemsPositions[itemId] = { x: x, y: y };

    let temp = somethingChanged + 1;
    setSomethingChanged(temp);
    setItemsPositions(itemsPositions);
  };

  const saveTablesPosition = () => {
    setLoading(true);

    Promise.all(
      Object.keys(tablesPositions).map(async (tableId) => {
        await updateTable(selectedOption.value, tableId, {
          xCoordinates: tablesPositions[tableId].x,
          yCoordinates: tablesPositions[tableId].y,
          rotationAngle: tablesPositions[tableId].rotationAngle,
        }).then((updatedTable) => {
          fetchTables(updatedTable.spaceId);
        });
      })
    )
      .then((res) => {
        notifySuccess("Tables saved");
        SetSaveTablesIsDisabled(true);
        setInitialTablesPosition(JSON.parse(JSON.stringify(tablesPositions)));
      })

      .catch((err) => {
        if (err.response.data.message === "Table not found.") {
          //deleted table is still in tablesPositions[tableId]
        } else {
          notifyError(`Error saving tables: ${err.response.data.message}`);
          console.error(err);
        }
      })
      .finally(() => {
        // Set loading to false regardless of success or error
        setLoading(false);
      });

    Promise.all(
      Object.keys(itemsPositions).map(async (itemId) => {
        if (
          itemsPositions[itemId].x === -15 &&
          itemsPositions[itemId].y === -15
        ) {
          await deleteSpaceItemById(itemId).catch((err) => {
            console.error(err);
          });
        }
        let foundItem = restaurantItemsOnTheGrid.find(
          (item) => item.id === itemId
        );
        if (foundItem) {
          if (itemId.length < 36) {
            if (
              foundItem!.xCoordinates === -15 &&
              foundItem!.yCoordinates === -15
            ) {
            } else
              await addSpaceItem(selectedOption.value, {
                itemType: foundItem!.itemType,
                xCoordinates: itemsPositions[itemId].x,
                yCoordinates: itemsPositions[itemId].y,
              }).then((createdItem) => {
                fetchItems(createdItem.spaceId);
              });
          } else {
            if (
              itemsPositions[foundItem!.id].x === -15 &&
              itemsPositions[foundItem!.id].y === -15
            ) {
            } else
              await updateSpaceItem(itemId, {
                xCoordinates: itemsPositions[itemId].x,
                yCoordinates: itemsPositions[itemId].y,
              }).then((updatedItem) => {
                fetchItems(updatedItem.spaceId);
              });
          }
        }
      })
    )
      .then((res) => {
        notifySuccess("Items saved");
        SetSaveTablesIsDisabled(true);
        setInitialItemsPosition(JSON.parse(JSON.stringify(itemsPositions)));
      })
      .catch((err) => {
        notifyError(`Error saving items: ${err}`);
        console.error(err);
      })
      .finally(() => {
        // Set loading to false regardless of success or error
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      JSON.stringify(initialTablesPosition) === JSON.stringify(tablesPositions)
    ) {
      SetSaveTablesIsDisabled(true);
    } else {
      SetSaveTablesIsDisabled(false);
    }
    if (
      JSON.stringify(initialItemsPosition) !== JSON.stringify(itemsPositions)
    ) {
      SetSaveTablesIsDisabled(false);
    }
  }, [somethingChanged]);

  return (
    <div className={classes.RestaurantTablesContainer}>
      <>
        <Row>
          <Col xs={12} lg={6}>
            <Title title={title} subtitle={subtitle} />
          </Col>
          <Col>
            <Row className={classes.header_second_col}>
              <div style={{ width: "auto" }} className={classes.save_changes}>
                {loading ? (
                  <Spinner
                    loading={loading}
                    type="button"
                    customClassName={classes["table-spinner-container"]} // Pass the new class as a prop
                  />
                ) : (
                  <Button
                    text="Save changes"
                    onClick={saveTablesPosition}
                    disabled={saveTablesIsDisabled}
                  />
                )}
              </div>
              <div
                style={{ width: "auto" }}
                className={classes.add_table_button}
              >
                <span className={`${classes.selectIcon} ${classes.tableIcon}`}>
                  {tableIcon}
                </span>
                <span className={`${classes.selectIcon} ${classes.arrowDown}`}>
                  {arrowDownIcon}
                </span>
                <Button
                  onClick={openItemsModal}
                  className={classes.add_table_button}
                  text="Add new item"
                />
                {showItemsModal && <ItemsModal />}
              </div>

              <Col className={classes.header_col}>
                <div>
                  <span className={classes.selectIcon}>{placeIcon}</span>
                  <SimpleSelect
                    value={selectedOption}
                    options={spaceOptions}
                    placeholder={"Select a space"}
                    onChange={handleRedirect}
                    styles={reservationStyle}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={3} style={{ width: "315px" }}>
            <div className={classes.main_container}>
              <div className={classes.content_sidebar}>
                <div className={classes.header}>
                  <div className={classes.place_name}>
                    {placeIcon}
                    {selectedOption ? selectedOption.label : "Select a space"}
                  </div>
                  <button
                    className={classes.edit}
                    onClick={() => {
                      setHalfPageForm("EDIT_SPACE");
                    }}
                  >
                    {editIcon}
                    Edit
                  </button>
                </div>
                <div className={classes.tables_container}>
                  {tables && tables.length === 0 ? (
                    <NoTables />
                  ) : (
                    tables.map((table) => (
                      <div
                        className={`${classes.floor} ${
                          tablesOnTheGrid.includes(table)
                            ? classes.selected
                            : ""
                        }`}
                        key={table.id}
                        onClick={() => setTableOnGrid(table)}
                      >
                        <div className={classes.content_floor}>
                          <img className={classes.dot} src={Dot} />
                          <div>
                            <p className={classes.table_name}>
                              {table.tableName}
                            </p>
                            <div className={classes.seats_info}>
                              <span className={classes.seats_icon}>
                                {" "}
                                {seatsIcon}
                              </span>
                              <p>0 / {table.seats}</p>
                            </div>
                          </div>
                          <FontAwesomeIcon
                            className={classes.three_dots}
                            icon={faEllipsisV}
                            onClick={(e) => {
                              openModal(table.id);
                              e.stopPropagation();
                            }}
                          />
                        </div>
                        {modalsState[table.id]?.firstModal && (
                          <TableModal id={table.id} />
                        )}
                      </div>
                      // {/* {<TableModal id={table.id} />} */}

                      // {/* modalsState[table.id]?.firstModal &&  */}
                    ))
                  )}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={8}>
            <div
              style={{
                background: "#FCFCFC",
                outline: "6px solid #eee",
                width: `${gridWidth}px`,
                height: `${gridHeight}px`,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Grid
                gridWidth={gridWidth}
                placeType={props.placeType}
                gridHeight={gridHeight}
                tables={tablesOnTheGrid}
                restaurantItems={restaurantItemsOnTheGrid}
                updateTablesPositionState={updateTablesPositionState}
                updateItemsPositionState={updateItemsPositionState}
                onReservations={false}
                selectedRotationTableId={selectedRotationTableId}
                rotationAngle={rotationAngle}
                handleRemoveRestaurantItemFromGrid={
                  handleRemoveRestaurantItemFromGrid
                }
              />
            </div>
          </Col>
        </Row>
      </>
      {isAddTableModalOpen && (
        <AddModal
          placeType={props.placeType}
          onClose={handleAddTableCloseModal}
        />
      )}
      {(halfPageForm === "ADD_SPACE" ||
        halfPageForm === "ADD_TABLE" ||
        halfPageForm === "EDIT_SPACE") && (
        <HalfPageForm
          title={`${
            halfPageForm === "ADD_SPACE"
              ? "Add new space"
              : halfPageForm === "ADD_TABLE"
              ? props.placeType === "HOTEL"
                ? "Add room"
                : "Add table"
              : halfPageForm === "EDIT_SPACE"
              ? "Edit space"
              : ""
          }`}
          onClose={closeHalfPageForm}
        >
          {halfPageForm === "ADD_SPACE" && (
            <NewSpaceForm
              onClose={closeHalfPageForm}
              placeType={props.placeType}
            />
          )}
          {halfPageForm === "EDIT_SPACE" && (
            <EditSpaceForm
              onClose={closeHalfPageForm}
              spaceToEdit={selectedOption.value}
              placeType={props.placeType}
            />
          )}
          {halfPageForm === "ADD_TABLE" && (
            <AddTableForm
              onClose={closeHalfPageForm}
              spaceId={selectedOption.value}
              placeType={props.placeType}
            />
          )}
        </HalfPageForm>
      )}
      {halfPageForm === "EDIT_TABLE" && (
        <HalfPageForm
          title={`${
            halfPageForm === "EDIT_TABLE"
              ? props.placeType === "HOTEL"
                ? "Edit Room"
                : "Edit table"
              : ""
          }`}
          onClose={closeHalfPageForm}
          items={[
            {
              name: "Details",
              component: (
                <EditTableForm
                  onClose={closeHalfPageForm}
                  tableId={tableToEdit}
                  currentSpaceId={selectedOption.value}
                  placeType={props.placeType}
                />
              ),
            },
            { name: "Reservations", info: "0", component: <></> },
          ]}
        ></HalfPageForm>
      )}
    </div>
  );
};

export default RestaurantTables;
