import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTransport,
  deleteTransport,
  getAllStaff,
  deleteDocument,
  getDocuments,
  getTransport,
  getTransportById,
  transportData,
  getAllStaffForTransport,
} from "../../auth/api/requests";
import {
  ascendentIcon,
  deleteMealIcon,
  descendentIcon,
  // duplicateIcon,
  editIcon,
  searchIcon,
  sortIcon,
  seatsIcon,
  locationIcon,
  truckIcon,
} from "../../icons/icons";
import Spinner from "../Spinner";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import NoTransport from "./NoTransport/NoTransport";
import classes from "./Transport.module.css";
import classesCreate from "./CreateTransport/CreateTransport.module.css";
import ReactPaginate from "react-paginate";
import { Employee, Restaurant } from "../Staff/StaffTypes";
import CreateTransport from "./CreateTransport/CreateTransport";
import TransportDetails, { Invoice } from "./DetailsTransport/TransportDetails";
import CustomSelect from "../Staff/EditEmployee/components/CustomSelect";
import CustomSelectStyles from "../Staff/EditEmployee/components/CustomSelectStyles";
import { NotificationButton } from "../Statistics/Header";
import { toast } from "react-toastify";
import EditTransport from "./EditTransport/EditTransport";

type Props = {};

type TransportType = {
  updatedAt: string;
  id: string;
  registrationNumber: string;
  seats: string;
  region: string;
  users: Employee[];
  mileage: number;
  type: string;
};

type Filter = {
  sortBy?: {
    column: string;
    order: string;
  };
  search?: string;
  pagination?: number;
};

const Transport = (props: Props) => {
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
      border: "1px solid #EEE",
      minWidth: "167px",

      "&:hover": {
        borderColor: "#FE9800 !important",
        boxShadow: "0 0 0 1px #FE9800",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#020202",
      opacity: "0.35",
    }),
    iconContainer: (provided: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  };
  const [transportArray, setTransportArray] = useState<TransportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // react-paginate uses zero-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [regions, setRegions] = useState("");
  const [filteredRegions, setFilteredRegions] = useState<TransportType[]>([]);
  const [sortOptions, setSortOptions] = useState({
    column: "name",
    order: "No Transport",
  });
  const [totalItems, setTotalItems] = useState(0);
  const initialTotalItemsRef = useRef<number | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transportName, setTransportName] = useState("");

  const regionOptions = [
    { value: "All Regions", label: "All regions" },
    { value: "Zona Nord", label: "Zona Nord" },
    { value: "Zona Centru", label: "Zona Centru" },
    { value: "Zona Sud", label: "Zona Sud" },
  ];

  const handleOpenModal = (transportName: string) => {
    setIsModalOpen(true);
    setTransportName(transportName);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleSelectedRegionChange = (selectedOption: any) => {
    if (selectedOption.value === "All Regions") {
      setRegions("");
      setFilteredRegions([]);
    } else {
      setRegions(selectedOption.value);
      if (Array.isArray(transportArray)) {
        const filteredTransport = transportArray.filter(
          (transport) => transport.region === selectedOption.value
        );
        setFilteredRegions(filteredTransport);
      } else {
        console.error("transport filtering did not return an array:");
      }
    }
  };

  const fetchData = async () => {
    try {
      const filter: Filter = {};

      if (sortOptions.order !== "No Transport") {
        filter.sortBy = sortOptions;
      }

      if (searchValue !== "") {
        filter.search = searchValue;
      }

      if (currentPage >= 0) {
        filter.pagination = currentPage * 10;
      }

      const transportResponse = await getTransport(filter);
      if (initialTotalItemsRef.current === null) {
        initialTotalItemsRef.current = transportResponse.pagination.totalItems;
      }
      const storedRestaurant = JSON.parse(
        localStorage.getItem("selectedRestaurant") ?? "null"
      );

      if (storedRestaurant) {
        // Fetch the restaurant details based on the ID from your data source
        setSelectedRestaurant(storedRestaurant);
      }
      setTransportArray(transportResponse.data);
      setCategories(transportResponse.categories);
      setTotalPages(transportResponse.pagination.totalPages);
      setTotalItems(initialTotalItemsRef.current ?? 0);
      setTimeout(setLoading.bind(null, false), 500);
    } catch (error) {
      console.error("Can't get transport:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, searchValue, sortOptions]);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const placeholderComponent = <>{locationIcon} Select region</>;
  const [headerClinets, setHeaderClinets] = useState([
    {
      value: "registrationNumber",
      label: "Transport ID",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "seats",
      label: "Seats",
      searchButton: false,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "region",
      label: "Region",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "users",
      label: "Drivers",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "mileage",
      label: "Mileage",
      searchButton: false,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "type",
      label: "Car Type",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "editTransport",
      label: "",
      searchButton: false,
      searchMode: false,
      sortMode: false,
      hovered: false,
      iconIndex: 0,
    },
    // {
    //   value: "duplicateButton",
    //   label: "",
    //   searchButton: false,
    //   searchMode: false,
    //   sortMode: false,
    //   hovered: false,
    //   iconIndex: 0,
    // },
    {
      value: "deleteButton",
      label: "",
      searchButton: false,
      searchMode: false,
      sortMode: false,
      hovered: false,
      iconIndex: 0,
    },
  ]);
  const succes = () =>
    toast.success("Deleted!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  const [transportId, setTransportId] = useState("");

  const [documents, setDocuments] = useState<Invoice[]>([]);
  const handleDeleteTransport = async (transportId: string) => {
    try {
      const fetchedDocuments = await getDocuments();

      // Filter documents based on props.transportId
      const filteredDocuments = fetchedDocuments.data.filter(
        (document) => document.itemId === transportId
      );

      // Delete each document
      const deleteDocumentPromises = filteredDocuments.map(async (document) => {
        try {
          await deleteDocument(document.id);
        } catch (error) {
          console.error("Error deleting document:", error);
        }
      });

      // Wait for all delete operations to complete
      await Promise.all(deleteDocumentPromises);

      // After all documents are deleted, you can delete the transport
      await deleteTransport(transportId);

      // Call success function or any other actions you want to perform after successful deletion
      succes();

      // Fetch data again if needed
      fetchData();
    } catch (error) {
      console.error("Error deleting transport:", error);
    }
  };

  // const handleDuplicateTransport = async (transportId: string) => {
  //   try {
  //     const transportDetails = await getTransportById(transportId);
  //     const userIds = transportDetails.users.map((user) => user.id);
  //     const newTransportData: transportData = {
  //       registrationNumber: "Copy of " + transportDetails.registrationNumber,
  //       restaurantId: transportDetails.restaurantId,
  //       seats: transportDetails.seats,
  //       mileage: transportDetails.mileage,
  //       region: transportDetails.region,
  //       type: transportDetails.type,
  //       userIds: userIds,
  //     };
  //     const createdTransport = await createTransport(newTransportData);
  //     toast.success("Transport duplicated");
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error duplicating transport:", error);
  //     toast.error("Error duplicating transport");
  //   }
  // };

  const handleCloseSearchMode = useCallback(() => {
    const updatedHeaderClinets = headerClinets.map((headerItem) => ({
      ...headerItem,
      searchMode: false,
    }));
    setHeaderClinets(updatedHeaderClinets);
    setDisplayValue("");
    setSearchValue("");
  }, [headerClinets]);

  const handleSort = (column: string, iconIndex: number) => {
    setHeaderClinets((prevHeaderClinets) => {
      const updatedHeaderClinets = prevHeaderClinets.map((item) => {
        if (item.value === column) {
          return {
            ...item,
            iconIndex: item.iconIndex === 0 ? 1 : item.iconIndex === 1 ? 2 : 0,
          };
        }
        return {
          ...item,
          iconIndex: 0,
        };
      });

      const updatedSortOptions = {
        column,
        order:
          iconIndex === 2 ? "No Transport" : iconIndex === 0 ? "ASC" : "DESC", // Toggle the order between ASC, DESC, and No Transport
      };
      setSortOptions(updatedSortOptions);

      return updatedHeaderClinets;
    });
  };

  const sortIcons = [
    { icon: sortIcon },
    { icon: ascendentIcon },
    { icon: descendentIcon },
  ];

  const [createItem, setCreateItem] = useState(false);
  const handleChangeCreateItem = () => {
    setCreateItem((prevState) => !prevState);
    fetchData();
  };

  const sortedTransportArray = (
    Array.isArray(transportArray) ? transportArray : []
  )
    .slice()
    .sort((a, b) => {
      // Assuming updateAt is a timestamp or a comparable value
      const timeA = a.updatedAt;
      const timeB = b.updatedAt;

      // Compare timestamps or values
      if (timeA > timeB) {
        return -1; // for descending order, use 1 for ascending order
      } else if (timeA < timeB) {
        return 1; // for descending order, use -1 for ascending order
      } else {
        return 0;
      }
    });

  const [openTransportDetails, setOpenTransportDetails] = useState(false);
  const handleOpenTransportDetails = (transportId) => {
    setOpenTransportDetails((prevState) => !prevState);
    setTransportId(transportId);
  };
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    const fetchEmployees = async (page: number) => {
      try {
        const response = await getAllStaffForTransport(page);
        if (Array.isArray(response.data)) {
          // Filter employees with role "DRIVER"
          const filteredEmployees = response.data.filter(
            (employee) => employee.role === "DRIVER"
          );
          setEmployees(filteredEmployees);
        } else {
          console.error("getAllStaff did not return an array:", response);
        }
        // setPagination(response.pagination);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setTimeout(setLoading.bind(null, false), 500);
      }
    };
    const fetchAllEmployees = async () => {
      setLoading(true);
      setEmployees([]);
      for (let page = 1; page <= totalPages; page++) {
        await fetchEmployees(page);
      }
    };

    fetchAllEmployees();
  }, []);
  

  // const filterTransportByUser = (transportArray, searchUsername) => {
  //   return transportArray.filter((transport) => {
  //     return transport.users.some((user) => user.username === searchUsername);
  //   });
  // };

  const handleEditSearchValue: (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedField: string
  ) => void = (e, selectedField) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    setSearchValue(inputValue);
  };
  // const resultForUsers = filterTransportByUser(sortedTransportArray, searchValue);
  // const resultForUsersText = filterTransportByUser(sortedTransportArray, "Andrei");

  const SearchFieldRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      {!loading ? (
        transportArray.length === 0 && totalItems === null ? (
          <NoTransport />
        ) : (
          <>
            {createItem === true ? (
              <CreateTransport
                handleClose={handleChangeCreateItem}
                categories={categories}
                transportArray={transportArray}
                setTransportArray={setTransportArray}
              />
            ) : openTransportDetails === true ? (
              <TransportDetails
                onCloseSideBar={handleOpenTransportDetails}
                transportId={transportId}
                employees={employees}
              />
            ) : null}
            <div className={classes.HeadContainer}>
              <div className={classes.Head}>
                <div className={classes.Heading}>
                  <div className={classes.Title}>
                    <h1 className={classes.TitleText}>Transport list</h1>
                  </div>
                  <div className={classes.Subtitle}>
                    <span className={classes.SubtitleText}>
                      {selectedRestaurant?.name} · {selectedRestaurant?.address}
                    </span>
                  </div>
                </div>
                <div className={classes.HeadActions}>
                  <button
                    className={classes.SaveChangesButton}
                    onClick={handleChangeCreateItem}
                  >
                    <span className={classes.SaveButtonText}>
                      Add new transport
                    </span>
                  </button>
                  <div className={classesCreate.SectionRow}>
                    <div className={classesCreate.InputContainer}>
                      <CustomSelect
                        onChange={handleSelectedRegionChange}
                        value={regions}
                        options={regionOptions}
                        placeholder={placeholderComponent}
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <NotificationButton />
                </div>
              </div>
            </div>
            <div className={classes.StockTable}>
              <div className={classes.TableHead}>
                {headerClinets.map((item, index) => (
                  <div
                    onMouseEnter={() => {
                      const updatedHeaderClinets = headerClinets.map(
                        (headerItem, i) => ({
                          ...headerItem,
                          hovered: i === index,
                        })
                      );
                      setHeaderClinets(updatedHeaderClinets);
                    }}
                    onMouseLeave={() => {
                      const updatedHeaderClinets = headerClinets.map(
                        (headerItem) => ({
                          ...headerItem,
                          hovered: false,
                        })
                      );
                      setHeaderClinets(updatedHeaderClinets);
                    }}
                    className={classes.HeaderItem}
                    key={item.label}
                  >
                    {item.searchMode ? (
                      <div
                        className={classes.SearchFieldContainer}
                        ref={SearchFieldRef}
                      >
                        <OutsideClickHandler
                          innerRef={SearchFieldRef}
                          onClose={handleCloseSearchMode}
                        />
                        <span className={classes.SearchIcon}>{searchIcon}</span>
                        <input
                          className={classes.SearchInput}
                          type="text"
                          placeholder={
                            item.value === "registrationNumber"
                              ? "Search for registrationNumber"
                              : item.value === "region"
                              ? "Search for region"
                              : item.value === "type"
                              ? "Search for car type"
                              : "Search for drivers"
                          }
                          value={displayValue}
                          onChange={(e) => handleEditSearchValue(e, item.value)}
                        />
                      </div>
                    ) : item.hovered ? (
                      <div className={classes.HoveredHeaderItem}>
                        <div className={classes.HoveredHeaderTextContainer}>
                          {item.sortMode ? (
                            <button
                              className={classes.HoveredHeaderText}
                              style={{
                                opacity: `${item.iconIndex !== 0 ? 1 : 0.6}`,
                              }}
                              onClick={() =>
                                handleSort(item.value, item.iconIndex)
                              }
                            >
                              {item.label}
                            </button>
                          ) : (
                            <div>{item.label}</div>
                          )}
                          <div className={classes.HoveredHeaderItemActions}>
                            {item.sortMode ? (
                              <button
                                className={classes.HoveredHeaderAction}
                                style={{
                                  opacity: `${item.iconIndex !== 0 ? 1 : 0.6}`,
                                }}
                              >
                                {sortIcons[item.iconIndex].icon}
                              </button>
                            ) : null}
                            {item.searchButton && item.iconIndex === 0 ? (
                              <button
                                className={classes.HoveredHeaderAction}
                                onClick={() => {
                                  const updatedHeaderClinets =
                                    headerClinets.map((headerItem, i) => ({
                                      ...headerItem,
                                      searchMode: i === index,
                                    }));
                                  setHeaderClinets(updatedHeaderClinets);
                                }}
                              >
                                {searchIcon}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={classes.NotHoveredHeaderItem}>
                        {item.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {(regions === "" ? sortedTransportArray : filteredRegions).map(
                (transport) => (
                  <div className={classes.ProductRow} key={transport.id}>
                    <div
                      className={classes.ProductNameContainer}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenTransportDetails(transport.id)}
                    >
                      <div className={classes.ProductStatusBackground}>
                        <span className={classes.ProductNameIcon}>
                          {truckIcon}
                        </span>
                        <span className={classes.ProductName}>
                          {transport.registrationNumber}
                        </span>
                      </div>
                    </div>
                    <div
                      className={classes.ProductStatusContainer}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenTransportDetails(transport.id)}
                    >
                      <div className={classes.ProductStatusBackground}>
                        <span className={classes.ProductStatusIcon}>
                          {seatsIcon}
                        </span>
                        <span className={classes.ProductStatus}>
                          {transport.seats}
                        </span>
                      </div>
                    </div>
                    <div className={classes.StockStatus}>
                      <span className={classes.StockStatusText}>
                        {locationIcon} {transport.region.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className={classes.ReorderLimit}>
                      <span className={classes.ReoderLimitText}>
                        {transport.users.length > 0
                          ? transport.users.map((user, index) => {
                              const employee = employees.find(
                                (emp) => emp.id === user.id
                              );
                              if (employee) {
                                return (
                                  <span
                                    key={user.id}
                                    className={classes.Drivers}
                                  >
                                    <img
                                      src={
                                        employee?.avatar?.startsWith("avatar_")
                                          ? require(`../../assets/${employee?.avatar}`)
                                              .default
                                          : employee?.avatar !== null &&
                                            !employee?.avatar?.startsWith(
                                              "avatar_"
                                            )
                                          ? employee?.avatarUrl
                                          : DEFAULT_IMAGE
                                      }
                                      alt={user.username}
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "8px",
                                      }}
                                    />
                                    {user.username}
                                    {index !== transport.users.length - 1 && ""}
                                  </span>
                                );
                              } else {
                                return (
                                  <span key={user.id}>
                                    {user.username}
                                    {index !== transport.users.length - 1 && ""}
                                  </span>
                                );
                              }
                            })
                          : "No Drivers"}
                      </span>
                    </div>
                    <div className={classes.ProductCategory}>
                      <div className={classes.ProductCategoryBackground}>
                        <span className={classes.ProductCategoryText}>
                          {transport.mileage} km
                        </span>
                      </div>
                    </div>
                    <div className={classes.ExpirationDate}>
                      <span className={classes.ExpirationDateText}>
                        {transport.type}
                      </span>
                    </div>
                    <div className={classes.EmptySpace}>
                      <button
                        className={classes.AddToOrder}
                        onClick={() => handleOpenModal(transport.id)}
                      >
                        <span className={classes.AddToOrderIcon}>
                          {editIcon}
                        </span>
                        <span className={classes.AddToOrderText}>Edit</span>
                      </button>
                    </div>

                    {/* <div
                      className={classes.DeleteButtonContainer}
                      onClick={() => handleDuplicateTransport(transport.id)}
                    >
                      <button className={classes.DeleteButton}>
                        <span className={classes.DeleteIcon}>
                          {duplicateIcon}
                        </span>
                      </button>
                    </div> */}
                    <div
                      className={classes.DeleteButtonContainer}
                      onClick={() => handleDeleteTransport(transport.id)}
                    >
                      <button className={classes.DeleteButton}>
                        <span className={classes.DeleteIcon}>
                          {deleteMealIcon}
                        </span>
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className={classes.Pagination}>
              {/* <span className={classes.NumberOfElements}>
                Shown {transportArray.length} of {totalItems} items
              </span> */}
              <div className={classes.Pages}>
                <ReactPaginate
                  pageCount={totalPages}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={classes.PageList}
                  activeClassName={classes.ActivePage}
                  activeLinkClassName={classes.ActivePageText}
                  pageClassName={classes.NotActivePage}
                  pageLinkClassName={classes.NotActivePageText}
                  breakLabel="..."
                  renderOnZeroPageCount={null}
                  previousClassName={classes.disabled}
                  nextClassName={classes.disabled}
                />
              </div>
              <div></div>
            </div>
          </>
        )
      ) : null}
      {isModalOpen && (
        <EditTransport
          handleClose={handleCloseModal}
          transportId={transportName}
          transportArray={transportArray}
          setTransportArray={setTransportArray}
        />
      )}
      <Spinner loading={loading} />
    </>
  );
};
export default Transport;
