import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { getStock } from "../../auth/api/requests";
import {
  ascendentIcon,
  deleteMealIcon,
  descendentIcon,
  dotIcon,
  NotificationsIcon,
  plusSizeIcon,
  searchIcon,
  sortIcon,
  warningIconForStock,
} from "../../icons/icons";
import Spinner from "../Spinner";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import NoStock from "./NoStock";
import classes from "./Stock.module.css";
import DefaultSupplierImage from "./DefaultSupplier.png";
import ReactPaginate from "react-paginate";
import { Restaurant } from "../Staff/StaffTypes";
import CreateItem from "./CreateItem";
import StockDetails from "./StockDetails";
import CreateOrder from "./CreateOrder";
import SuppliersTable from "./SuppliersTable";
import { NotificationButton } from "../Statistics/Header";

type Props = {};
type Tab = {
  id: string;
  name: string;
};

type StockType = {
  updatedAt: string;
  id: string;
  title: string;
  category: string;
  expirationDate: string;
  volume: number;
  reorderLimit: number;
  suplierId: string;
  pcVolume: number;
  unit: string;
  stockStatus: string;
  suplierName: string;
  suplierImage: string;
};

type Filter = {
  sortBy?: {
    column: string;
    order: string;
  };
  search?: string;
  pagination?: number;
};

const Stock = (props: Props) => {
  const [stockArray, setStockArray] = useState<StockType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // react-paginate uses zero-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [sortOptions, setSortOptions] = useState({
    column: "name",
    order: "No Order",
  });
  const [totalItems, setTotalItems] = useState(0);
  const initialTotalItemsRef = useRef<number | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockName, setStockName] = useState("");

  const handleOpenModal = (stockName: string) => {
    setIsModalOpen(true);
    setStockName(stockName);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter: Filter = {};

        if (sortOptions.order !== "No Order") {
          filter.sortBy = sortOptions;
        }

        if (searchValue !== "") {
          filter.search = searchValue;
        }

        if (currentPage >= 0) {
          filter.pagination = currentPage * 10;
        }

        const stockResponse = await getStock(filter);
        if (initialTotalItemsRef.current === null) {
          initialTotalItemsRef.current = stockResponse.pagination.totalItems;
        }
        const storedRestaurant = JSON.parse(
          localStorage.getItem("selectedRestaurant") ?? "null"
        );

        if (storedRestaurant) {
          // Fetch the restaurant details based on the ID from your data source
          setSelectedRestaurant(storedRestaurant);
        }
        setStockArray(stockResponse.data);
        setCategories(stockResponse.categories);
        setTotalPages(stockResponse.pagination.totalPages);
        setTotalItems(initialTotalItemsRef.current ?? 0);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Can't get stock:", error);
      }
    };
    fetchData();
  }, [currentPage, searchValue, sortOptions]);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const Tabs = [
    {
      id: "1",
      name: "Ingredients",
    },
    {
      id: "2",
      name: "Suppliers",
    },
    {
      id: "3",
      name: "Tools",
    },
  ];

  const [selectedTab, setSelectedTab] = useState<Tab | null>(Tabs[0]);
  const handleSelectTab = (tab) => {
    setSelectedTab(tab);
  };

  const [headerClinets, setHeaderClinets] = useState([
    {
      value: "title",
      label: "Name",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "volume",
      label: "Current stock",
      searchButton: false,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "stockStatus",
      label: "Stock status",
      searchButton: false,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "reorderLimit",
      label: "Reorder limit",
      searchButton: false,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "category",
      label: "Category",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "expirationDate",
      label: "Expiration date",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "suplierName",
      label: "Supplier",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "addToOrder",
      label: "",
      searchButton: false,
      searchMode: false,
      sortMode: false,
      hovered: false,
      iconIndex: 0,
    },
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

  function formatDate(inputValue) {
    const numericValue = inputValue.replace(/\D/g, "");

    let formattedValue = "";
    if (numericValue.length > 0) {
      const day = numericValue.slice(0, 2);
      if (day > 31) {
        formattedValue += "31";
      } else {
        formattedValue += day;
      }
    }
    if (numericValue.length > 2) {
      const month = numericValue.slice(2, 4);
      if (month > 12) {
        formattedValue += "/12";
      } else {
        formattedValue += `/${month}`;
      }
    }
    if (numericValue.length > 4) {
      const year = numericValue.slice(4, 8);
      const currentYear = new Date().getFullYear();
      if (year > currentYear) {
        formattedValue += `/${currentYear}`;
      } else {
        formattedValue += `/${year}`;
      }
    }

    return formattedValue;
  }

  function toSearchValue(formattedValue) {
    if (formattedValue) {
      const [day, month, year] = formattedValue.split("/");
      if (month === undefined) {
        if (day.length === 1) {
          return `0${day}`;
        } else {
          return `${day}`;
        }
      } else if (year === undefined) {
        if (month.length === 1) {
          return `0${month}-${day}`;
        } else {
          return `${month}-${day}`;
        }
      } else {
        return `${year}-${month}-${day}`;
      }
    }
    return "";
  }

  const handleEditSearchValue: (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedField: string
  ) => void = (e, selectedField) => {
    const inputValue = e.target.value;
    const inputWithoutSpaces = inputValue.replace(/\s/g, "");
    // const cleanSearchValue = inputWithoutSpaces.replace(/\+/g, "");

    if (selectedField === "expirationDate") {
      const formattedDate = formatDate(inputWithoutSpaces);
      const formattedSearchValue = toSearchValue(formattedDate);

      setDisplayValue(formattedDate);
      setSearchValue(formattedSearchValue);
    } else {
      if (inputValue.length <= 20) {
        setDisplayValue(inputWithoutSpaces);
        setSearchValue(inputWithoutSpaces);
      }
    }
  };

  const SearchFieldRef = useRef<HTMLDivElement | null>(null);

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
        order: iconIndex === 2 ? "No Order" : iconIndex === 0 ? "ASC" : "DESC", // Toggle the order between ASC, DESC, and No Order
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
  };

  const [stockId, setStockId] = useState("");

  const [openStockDetails, setOpenStockDetails] = useState(false);
  const handleOpenStockDetails = (stockId) => {
    setOpenStockDetails((prevState) => !prevState);
    setStockId(stockId);
  };

  const sortedStockArray = (Array.isArray(stockArray) ? stockArray : [])
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

  return (
    <>
      {!loading ? (
        stockArray.length === 0 && totalItems === null ? (
          <NoStock />
        ) : (
          <>
            {createItem === true ? (
              <CreateItem
                handleClose={handleChangeCreateItem}
                categories={categories}
                stockArray={stockArray}
                setStockArray={setStockArray}
              />
            ) : openStockDetails === true ? (
              <StockDetails
                onCloseSideBar={handleOpenStockDetails}
                stockId={stockId}
              />
            ) : null}
            <div className={classes.HeadContainer}>
              <div className={classes.Head}>
                <div className={classes.Heading}>
                  <div className={classes.Title}>
                    <h1 className={classes.TitleText}>Inventory list</h1>
                  </div>
                  <div className={classes.Subtitle}>
                    <span className={classes.SubtitleText}>
                      {selectedRestaurant?.name} · {selectedRestaurant?.address}
                    </span>
                  </div>
                </div>
                <div className={classes.HeadActions}>
                  {/* <button className={classes.SaveChangesButton}>
                    <span className={classes.SaveButtonText}>Save changes</span>
                  </button> */}
                  <button
                    className={classes.SaveChangesButton}
                    onClick={handleChangeCreateItem}
                  >
                    <span className={classes.SaveButtonText}>Add new item</span>
                  </button>
                 <NotificationButton/>
                </div>
              </div>
              <div className={classes.Tabs}>
                <div className={classes.TabList}>
                  {Tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`${classes.Tab} ${
                        selectedTab && selectedTab.id === tab.id
                          ? classes.SelectedTab
                          : ""
                      }`}
                      onClick={() => handleSelectTab(tab)}
                    >
                      <span
                        className={`${classes.TabText} ${
                          selectedTab && selectedTab.id === tab.id
                            ? classes.SelectedTabText
                            : ""
                        }`}
                      >
                        {tab.name}
                      </span>{" "}
                    </div>
                  ))}
                </div>
                {/* <button className={classes.CreateCategoryButton}>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      color: "#020202",
                      display: "flex",
                      opacity: "0.35",
                    }}
                  >
                    {plusSizeIcon}
                  </span>
                  <span className={classes.CreateCategoryText}>
                    Create Category
                  </span>
                </button> */}
              </div>
            </div>
            {selectedTab?.id === "1" ? (
              <>
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
                            <span className={classes.SearchIcon}>
                              {searchIcon}
                            </span>
                            <input
                              className={classes.SearchInput}
                              type="text"
                              placeholder={
                                item.value === "username"
                                  ? "Search for name or surname"
                                  : item.value === "phoneNumber"
                                  ? "Search for phone number"
                                  : item.value === "email"
                                  ? "Search for email"
                                  : "Search for date"
                              }
                              value={displayValue}
                              onChange={(e) =>
                                handleEditSearchValue(e, item.value)
                              }
                            />
                          </div>
                        ) : item.hovered ? (
                          <div className={classes.HoveredHeaderItem}>
                            <div className={classes.HoveredHeaderTextContainer}>
                              {item.sortMode ? (
                                <button
                                  className={classes.HoveredHeaderText}
                                  style={{
                                    opacity: `${
                                      item.iconIndex !== 0 ? 1 : 0.6
                                    }`,
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
                                      opacity: `${
                                        item.iconIndex !== 0 ? 1 : 0.6
                                      }`,
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
                  {sortedStockArray.map((product) => (
                    <div
                      className={classes.ProductRow}
                      key={product.id}
                      style={{
                        background: `${
                          product.volume > 0 ? "#FFF" : "#F6F6F6"
                        }`,
                      }}
                    >
                      <div
                        className={classes.ProductNameContainer}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenStockDetails(product.id)}
                      >
                        <span className={classes.ProductName}>
                          {product.title}
                        </span>
                      </div>
                      <div className={classes.ProductStatusContainer}>
                        <div
                          className={classes.ProductStatusBackground}
                          style={{
                            backgroundColor: `${
                              product.stockStatus === "Out-of-stock"
                                ? "#FFF"
                                : product.stockStatus === "Low stock"
                                ? "rgba(242, 54, 54, 0.20)"
                                : product.stockStatus === "Sufficient"
                                ? "rgba(116, 229, 114, 0.20)"
                                : "rgba(254, 152, 0, 0.20)"
                            }`,
                            border: `${
                              product.volume === 0 ? "1px solid #EEE" : "0px"
                            }`,
                          }}
                        >
                          <span
                            className={classes.ProductStatus}
                            style={{
                              color: `${
                                product.stockStatus === "Out-of-stock"
                                  ? "rgba(2,2,2,0.35)"
                                  : product.stockStatus === "Low stock"
                                  ? "#F23636"
                                  : product.stockStatus === "Sufficient"
                                  ? "#23B121"
                                  : "#FE9800"
                              }`,
                            }}
                          >
                            {product.volume}
                          </span>
                        </div>
                        {product.stockStatus === "Out-of-stock" ||
                        product.stockStatus === "Low stock" ? (
                          <div>{warningIconForStock}</div>
                        ) : null}
                      </div>
                      <div className={classes.StockStatus}>
                        <span
                          className={classes.StockStatusText}
                          style={{
                            color: `${
                              product.stockStatus === "Out-of-stock"
                                ? "#F23636"
                                : product.stockStatus === "Low stock"
                                ? "#F23636"
                                : product.stockStatus === "Sufficient"
                                ? "rgba(2, 2, 2, 0.8)"
                                : "#FE9800"
                            }`,
                          }}
                        >
                          {product.stockStatus}
                        </span>
                      </div>
                      <div className={classes.ReorderLimit}>
                        <span className={classes.ReoderLimitText}>
                          {product.reorderLimit}
                        </span>
                      </div>
                      <div className={classes.ProductCategory}>
                        <div
                          className={classes.ProductCategoryBackground}
                          style={{
                            background: `${
                              product.volume > 0
                                ? "rgba(2, 2, 2, 0.05)"
                                : "rgba(2, 2, 2, 0.05)"
                            }`,
                          }}
                        >
                          <span
                            className={classes.ProductCategoryText}
                            style={{
                              opacity: product.volume > 0 ? "1" : "0.35",
                            }}
                          >
                            {product.category.charAt(0).toUpperCase() +
                              product.category
                                .replace(/_/g, " ")
                                .slice(1)
                                .toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <div className={classes.ExpirationDate}>
                        <span className={classes.ExpirationDateText}>
                          {dayjs(product.expirationDate).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <div className={classes.Supplier}>
                        <div className={classes.SupplierContainer}>
                          <div className={classes.ImageContainer}>
                            <div
                              className={classes.SupplierImage}
                              style={{
                                background: `${
                                  product.suplierImage ||
                                  `url(${DefaultSupplierImage})`
                                }, 3.518px 3.566px / 64.34% 64.34% no-repeat`,
                              }}
                            ></div>
                          </div>
                          <span className={classes.SupplierName}>
                            {product.suplierName}
                          </span>
                        </div>
                      </div>
                      {product.stockStatus === "Sufficient" ? (
                        <div className={classes.EmptySpace}></div>
                      ) : (
                        <div className={classes.EmptySpace}>
                          <button
                            className={classes.AddToOrder}
                            onClick={() => handleOpenModal(product.title)}
                          >
                            <span className={classes.AddToOrderIcon}>
                              {plusSizeIcon}
                            </span>
                            <span className={classes.AddToOrderText}>
                              Add to order
                            </span>
                          </button>
                        </div>
                      )}
                      <div className={classes.DeleteButtonContainer}>
                        <button className={classes.DeleteButton}>
                          <span className={classes.DeleteIcon}>
                            {deleteMealIcon}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={classes.Pagination}>
                  <span className={classes.NumberOfElements}>
                    Shown {stockArray.length} of {totalItems} items
                  </span>
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
            ) : selectedTab?.id === "2" ? (
              <SuppliersTable />
            ) : null}
          </>
        )
      ) : null}
      <Spinner loading={loading} />
      {isModalOpen ? (
        <CreateOrder handleClose={handleCloseModal} stockName={stockName} />
      ) : null}
    </>
  );
};
export default Stock;
