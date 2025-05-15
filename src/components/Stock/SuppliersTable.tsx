import { useCallback, useEffect, useRef, useState } from "react";
import { getSuppliersWithoutPageLimit } from "../../auth/api/requests";
import {
  ascendentIcon,
  descendentIcon,
  searchIcon,
  sortIcon,
} from "../../icons/icons";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import classes from "./SuppliersTable.module.css";
import DefaultSupplierImage from "./DefaultSupplier.png";
import dayjs from "dayjs";

type Props = {};
const SuppliersTable = (props: Props) => {
  const [headerSuppliers, setHeaderSuppliers] = useState([
    {
      value: "name",
      label: "Company name",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "phoneNumber",
      label: "Phone number",
      searchButton: true,
      searchMode: false,
      sortMode: false,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "email",
      label: "E-mail address",
      searchButton: true,
      searchMode: false,
      sortMode: false,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "lastOrder",
      label: "Last order",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "orderVolume",
      label: "Irders volume",
      searchButton: false,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
  ]);

  const SearchFieldRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");

  const formatPhoneNumber = (number) => {
    const phoneNumber = number?.replace(/\D/g, "");

    return (
      "+" +
      phoneNumber.slice(0, 3) +
      " " +
      phoneNumber.slice(3, 5) +
      " " +
      phoneNumber.slice(5, 8) +
      " " +
      phoneNumber.slice(8)
    );
  };

  const handleCloseSearchMode = useCallback(() => {
    const updatedHeaderSuppliers = headerSuppliers.map((headerItem) => ({
      ...headerItem,
      searchMode: false,
    }));
    setHeaderSuppliers(updatedHeaderSuppliers);
    setDisplayValue("");
    setSearchValue("");
  }, [headerSuppliers]);

  function toSearchValue(formattedValue) {
    if (formattedValue) {
      const sanitizedValue = formattedValue.replace(/[^0-9]/g, "");
      return sanitizedValue;
    }
  }

  function formatPhoneNumberForDisplay(input) {
    if (!input) return input;
    const numberInput = input.replace(/[^\d]/g, "");
    const numberInputLength = numberInput.length;
    const countryCode = "+373";
    if (numberInputLength <= 5) {
      return numberInput.startsWith("373") || numberInput.startsWith("+373")
        ? `+${numberInput.slice(0, 3)} ${numberInput.slice(3, 5)}`
        : `${countryCode} ${numberInput}`;
    } else if (numberInputLength <= 8) {
      return numberInput.startsWith("373") || numberInput.startsWith("+373")
        ? `+${numberInput.slice(0, 3)} ${numberInput.slice(
            3,
            5
          )} ${numberInput.slice(5, 8)}`
        : `${countryCode} ${numberInput.slice(0, 3)} ${numberInput.slice(3)}`;
    } else {
      return numberInput.startsWith("373") || numberInput.startsWith("+373")
        ? `+${numberInput.slice(0, 3)} ${numberInput.slice(
            3,
            5
          )} ${numberInput.slice(5, 8)} ${numberInput.slice(8, 11)}`
        : `${countryCode} ${numberInput.slice(0, 2)} ${numberInput.slice(
            2,
            5
          )} ${numberInput.slice(5, 8)}`;
    }
  }

  const handleEditSearchValue: (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedField: string
  ) => void = (e, selectedField) => {
    const inputValue = e.target.value;
    const inputWithoutSpaces = inputValue.replace(/\s/g, "");
    const cleanSearchValue = inputWithoutSpaces.replace(/\+/g, "");

    if (selectedField === "phoneNumber") {
      const formattedValue = formatPhoneNumberForDisplay(inputWithoutSpaces);
      setDisplayValue(formattedValue);
      setSearchValue(cleanSearchValue);
    } else {
      if (inputValue.length <= 20) {
        setDisplayValue(inputWithoutSpaces);
        setSearchValue(inputWithoutSpaces);
      }
    }
  };

  const [sortOptions, setSortOptions] = useState({
    column: "name",
    order: "No Order",
  });

  const handleSort = (column: string, iconIndex: number) => {
    setHeaderSuppliers((prevHeaderClinets) => {
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

  type SupplierType = {
    id: string;
    updatedAt: string;
    name: string;
    phoneNumber: string;
    email: string;
    image: string;
    lastOrder: string;
    orderVolume: number;
  };
  const [suppliersArray, setSuppliersArray] = useState<SupplierType[]>([]);

  const sortedSuppliersArray = (
    Array.isArray(suppliersArray) ? suppliersArray : []
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

  type Filter = {
    sortBy?: {
      column: string;
      order: string;
    };
    search?: string;
    pagination?: number;
  };

  const [loading, setLoading] = useState(true);

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

        const supplierResponse = await getSuppliersWithoutPageLimit(filter);

        // const storedRestaurant = JSON.parse(
        //   localStorage.getItem("selectedRestaurant") ?? "null"
        // );

        // if (storedRestaurant) {
        //   setSelectedRestaurant(storedRestaurant);
        // }
        setSuppliersArray(supplierResponse.data);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Can't get stock:", error);
      }
    };
    fetchData();
  }, [searchValue, sortOptions]);

  const [supplierId, setSupplierId] = useState("");

  const [openStockDetails, setOpenStockDetails] = useState(false);
  const handleOpenStockDetails = (supplierId) => {
    setOpenStockDetails((prevState) => !prevState);
    setSupplierId(supplierId);
  };

  return (
    <div className={classes.StockTable}>
      <div className={classes.TableHead}>
        {headerSuppliers.map((item, index) => (
          <div
            onMouseEnter={() => {
              const updatedHeaderSuppliers = headerSuppliers.map(
                (headerItem, i) => ({
                  ...headerItem,
                  hovered: i === index,
                })
              );
              setHeaderSuppliers(updatedHeaderSuppliers);
            }}
            onMouseLeave={() => {
              const updatedHeaderSuppliers = headerSuppliers.map(
                (headerItem) => ({
                  ...headerItem,
                  hovered: false,
                })
              );
              setHeaderSuppliers(updatedHeaderSuppliers);
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
                    item.value === "name"
                      ? "Search for company name"
                      : item.value === "phoneNumber"
                      ? "Search for phone number"
                      : item.value === "email"
                      ? "Search for email"
                      : "Search for date"
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
                      onClick={() => handleSort(item.value, item.iconIndex)}
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
                          const updatedHeaderSuppliers = headerSuppliers.map(
                            (headerItem, i) => ({
                              ...headerItem,
                              searchMode: i === index,
                            })
                          );
                          setHeaderSuppliers(updatedHeaderSuppliers);
                        }}
                      >
                        {searchIcon}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className={classes.NotHoveredHeaderItem}>{item.label}</div>
            )}
          </div>
        ))}
      </div>
      {sortedSuppliersArray.map((supplier) => (
        <div className={classes.ProductRow} key={supplier.id}>
          <div className={classes.Supplier}>
            <div className={classes.SupplierContainer}>
              <div className={classes.ImageContainer}>
                <div
                  className={classes.SupplierImage}
                  style={{
                    background: `${
                      supplier.image || `url(${DefaultSupplierImage})`
                    }, 3.518px 3.566px / 64.34% 64.34% no-repeat`,
                  }}
                ></div>
              </div>
              <span className={classes.SupplierName}>{supplier.name}</span>
            </div>
          </div>
          <div className={classes.ProductStatusContainer}>
            <div className={classes.ProductStatusBackground}>
              <span className={classes.ProductStatus}>
                {formatPhoneNumber(supplier.phoneNumber)}
              </span>
            </div>
          </div>
          <div className={classes.StockStatus}>
            <span className={classes.StockStatusText}>{supplier.email}</span>
          </div>
          <div className={classes.ReorderLimit}>
            <span className={classes.ReoderLimitText}>
              {supplier.lastOrder === null ? (
                <span className={classes.NoLastOrder}>—</span>
              ) : (
                <span style={{ textDecoration: "underline" }}>
                  {dayjs(supplier.lastOrder).format("DD/MM/YYYY")}
                </span>
              )}
            </span>
          </div>
          <div className={classes.ProductCategory}>
            <div className={classes.ProductCategoryBackground}>
              {supplier.orderVolume === null ? (
                <span className={classes.NoLastOrder}>—</span>
              ) : (
                <>
                  <span className={classes.Currency}>MDL</span>
                  <span className={classes.SupplierName}>
                    {supplier.orderVolume}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SuppliersTable;
