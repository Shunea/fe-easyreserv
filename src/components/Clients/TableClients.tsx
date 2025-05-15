import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import classes from "./TableClients.module.css";
import {
  ascendentIcon,
  ClientArrow,
  clientDot,
  descendentIcon,
  searchIcon,
  sortIcon,
} from "src/icons/icons";
import { Client } from "../Staff/StaffTypes";
import Spinner from "../Spinner";
import { getAllClients } from "../../auth/api/requests";
import ClientHistory from "./ClientHistory";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";

type TableClientsProps = {
  clients: Client[];
  setSortOptions: (options) => void;
  loading: any;
  setSearchValue: (value) => void;
};

const TableClients: React.FC<TableClientsProps> = ({
  clients,
  setSortOptions,
  loading,
  setSearchValue,
}) => {
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  // const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [headerClinets, setHeaderClinets] = useState([
    {
      value: "username",
      label: "Full Name",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "status",
      label: "Status",
      searchButton: false,
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
      value: "lastVisit",
      label: "Last Visit",
      searchButton: true,
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
    {
      value: "ordersVolume",
      label: "Orders volume",
      searchMode: false,
      sortMode: true,
      hovered: false,
      iconIndex: 0,
    },
  ]);

  const [hoveredClient, setHoveredClient] = useState<Client | null>(null);

  const handleClientMouseEnter = (client) => {
    setHoveredClient(client);
  };

  const handleClientMouseLeave = () => {
    setHoveredClient(null);
  };

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

  function formatPhoneNumberFromBack(input) {
    const phoneNumber = input?.replace(/\D/g, "");

    if (phoneNumber?.length >= 3) {
      const formattedNumber = `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
        3,
        5
      )} ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8)}`;
      return formattedNumber;
    } else return phoneNumber;
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
    const cleanSearchValue = inputWithoutSpaces.replace(/\+/g, "");

    if (selectedField === "phoneNumber") {
      const formattedValue = formatPhoneNumberForDisplay(inputWithoutSpaces);
      setDisplayValue(formattedValue);
      setSearchValue(cleanSearchValue);
    } else if (selectedField === "lastVisit") {
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

  const [clientHistoryIsOpen, setClientHistoryIsOpen] = useState(false);

  const handleOpenClientHistory = (clientId) => {
    setClientHistoryIsOpen((prevState) => !prevState);
    setSelectedClientId(clientId);
  };

  const sortIcons = [
    { icon: sortIcon },
    { icon: ascendentIcon },
    { icon: descendentIcon },
  ];

  return (
    <>
      {!loading ? (
        <div className={classes.ClientsContainer}>
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
                        item.value === "username"
                          ? "Search for name or surname"
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
                              const updatedHeaderClinets = headerClinets.map(
                                (headerItem, i) => ({
                                  ...headerItem,
                                  searchMode: i === index,
                                })
                              );
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
          {(Array.isArray(clients) ? clients : []).map((user) => (
            <div className={classes.ClientRow} key={user.id}>
              <div
                className={classes.ClientName}
                onClick={() => handleOpenClientHistory(user.id)}
                onMouseEnter={() => handleClientMouseEnter(user)}
                onMouseLeave={() => handleClientMouseLeave()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: `${
                      user.id === hoveredClient?.id ? "#F6F6F6" : "transparent"
                    }`,
                    borderRadius: "100px",
                    padding: "0px 4px",
                  }}
                >
                  <img
                    src={
                      user.avatar &&
                      user.avatar.split("/").pop()?.startsWith("avatar_")
                        ? require(`../../assets/${user?.avatar
                            .split("/")
                            .pop()}`).default
                        : user?.avatar !== null
                        ? user?.avatar
                        : DEFAULT_IMAGE
                    }
                    alt={user.username}
                    className={classes.ClientAvatar}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    <span className={classes.ClientNameText}>
                      {user.username}
                    </span>
                    {user.id === hoveredClient?.id ? (
                      <span style={{ opacity: 0.2, display: "flex" }}>
                        {ClientArrow}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={classes.ClientStatus}>
                <div
                  className={`${classes.Status} ${
                    user.status === "Unique"
                      ? classes.Unique
                      : classes.Recurrement
                  }`}
                >
                  <span className={classes.ClientDot}>{clientDot}</span>
                  <span className={classes.ClientStatusText}>
                    {user.status}
                  </span>
                </div>
              </div>
              <span className={classes.ClientPhone}>
                {formatPhoneNumberFromBack(user.phoneNumber)}
              </span>
              <span className={classes.ClientEmail}>{user.email}</span>
              <span className={classes.ClientVisit}>
                {moment(user.lastVisit).format("DD/MM/YYYY")}
              </span>
              <div className={classes.ClientOrders}>
                <span className={classes.Currency}>MDL</span>
                <span className={classes.ClientsOrdersSumm}>
                  {user.ordersVolume !== null ? user.ordersVolume : "00.00"}
                </span>
              </div>
            </div>
          ))}
          {clientHistoryIsOpen && (
            <ClientHistory
              clientId={selectedClientId}
              handleClose={() => handleOpenClientHistory("")}
            />
          )}
        </div>
      ) : (
        <Spinner loading={loading} />
      )}
    </>
  );
};

export default TableClients;
