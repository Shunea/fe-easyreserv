import React, { useCallback, useEffect, useRef, useState } from "react";
import classes from "./SideBar.module.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import {
  accoutantIcon,
  arrowDownIcon,
  calendarIcon,
  clientIcon,
  cuttleryIcon,
  doubleArrowIcon,
  editIcon,
  menuIcon,
  plusCircleIcon,
  reportIcon,
  seatsIcon,
  settingsIcon,
  soonLabelIcon,
  stockIcon,
  mealIcon,
  CreatePlacePlusIcon,
  checkedRestaurantIcon,
  DashboardSidebarIcon,
  MessageIcon,
  transportIcon,
  deliveryIcon,
  receiptIcon,
  reportingIcon,
} from "../icons/icons";
import { useNavigate } from "react-router-dom";
import OutsideClick from "./../hooks/outsideClick";
import {
  getAllAboutPlaces,
  getAllCurrentPlaces,
  logoutUser,
  putSwitchAccesToken,
  getAdminRestaurantData,
  getRestaurantById,
} from "src/auth/api/requests";
import { useDispatch } from "react-redux";
import { createPlaceFormDataActions } from "src/store/formData";
import { Restaurant } from "../components/Staff/StaffTypes";
import storage from "../utils/storage";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isAdmin = storage.getRole() === 'ADMIN';
  const editPlace = async () => {
    await getAllAboutPlaces()
      .then((place) => {
        place = place[0];

        let spacesWithFixedDurationFromDB = [];
        if (place.restaurant[0].spaces !== undefined) {
          spacesWithFixedDurationFromDB = place.restaurant[0].spaces.map(
            (space: any) => {
              if (typeof space.duration === "number") {
                var hours = space.duration / 60;
                var rhours = Math.floor(hours);
                var minutes = (hours - rhours) * 60;
                var rminutes = Math.round(minutes);
                return {
                  ...space,
                  duration: {
                    value: space.duration,
                    label: `${rhours === 0 ? "" : `${rhours}h`}${
                      rminutes === 0 ? "" : `${rminutes}min`
                    }`,
                  },
                };
              }
            }
          );
        }

        dispatch(createPlaceFormDataActions.setPlaceType(place.placeType));
        dispatch(createPlaceFormDataActions.setPlaceId(place.id));
        dispatch(createPlaceFormDataActions.setName(place.restaurant[0].name));
        dispatch(
          createPlaceFormDataActions.setImageKey(place.restaurant[0].image)
        );
        dispatch(
          createPlaceFormDataActions.setCategory(
            place.restaurant[0].cuisineType
          )
        );
        dispatch(
          createPlaceFormDataActions.setRestaurantId(place.restaurant[0].id)
        );
        let i = 0;
        let workScheduleFromDB = {};
        for (let day in place.restaurant[0].workSchedule) {
          let a = Object.keys(place.restaurant[0].workSchedule)[i];
          if (place.restaurant[0].workSchedule[a].isOpen) {
            workScheduleFromDB[a] = {
              isOpen: place.restaurant[0].workSchedule[day].isOpen,
              openingTime: {
                label: place.restaurant[0].workSchedule[day].openingTime,
                value: place.restaurant[0].workSchedule[day].openingTime,
              },
              closingTime: {
                label: place.restaurant[0].workSchedule[day].closingTime || "",
                value: place.restaurant[0].workSchedule[day].closingTime || "",
              },
            };
          } else {
            workScheduleFromDB[a] = {
              isOpen: place.restaurant[0].workSchedule[day].isOpen,
              openingTime: { label: "From", value: "" },
              closingTime: { label: "Until", value: "" },
            };
          }
          i++;
        }
        dispatch(createPlaceFormDataActions.setSchedule(workScheduleFromDB));
        dispatch(
          createPlaceFormDataActions.setPhoneNumber(
            place.restaurant[0].phoneNumber
          )
        );
        dispatch(
          createPlaceFormDataActions.setLocation(place.restaurant[0].address)
        );
        dispatch(
          createPlaceFormDataActions.setEmail(place.restaurant[0].email)
        );
        dispatch(
          createPlaceFormDataActions.setSpaces(spacesWithFixedDurationFromDB)
        );
        navigate("/edit-place/create");
      })

      .catch((err) => {
        console.error("Error submitting data", err);
      });
  };
  const sidebarMenuLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: DashboardSidebarIcon,
      soon: false,
    },
    {
      to: "/reservations",
      label: "Reservations",
      icon: calendarIcon,
      soon: false,
    },
    {
      to: "/restaurant",
      label: "Restaurant",
      icon: cuttleryIcon,
      soon: false,
    },
    {
      to: "/staff",
      label: "Staff",
      icon: seatsIcon,
      soon: false,
    },
    {
      to: "/stock",
      label: "Stock",
      icon: stockIcon,
      soon: false,
    },
    {
      to: "/menu",
      label: "Menu",
      icon: mealIcon,
      soon: false,
    },
    {
      to: "/client",
      label: "Client",
      icon: clientIcon,
      soon: false,
    },
    {
      to: "/statistics",
      label: "Statistics",
      icon: reportIcon,
      soon: false,
    },
    {
      to: "/reporting",
      label: "Reporting",
      icon: reportingIcon,
      soon: false,
    },
    {
      to: "/receipt",
      label: "Receipt",
      icon: receiptIcon,
      soon: false,
    },
    {
      to: "/communication",
      label: "Communication",
      icon: MessageIcon,
      soon: false,
    },
    {
      to: "/transport",
      label: "Transport",
      icon: transportIcon,
      soon: false,
    },
    {
      to: "/delivery",
      label: "Delivery",
      icon: deliveryIcon,
      soon: false,
    },
    {
      to: "/accoutant",
      label: "Accoutant",
      icon: accoutantIcon,
      soon: true,
    },
    {
      to: "/settings#planManagement",
      label: "Settings",
      icon: settingsIcon,
      soon: false,
    },
  ];
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
  };

  const [isToggled, setIsToggled] = useState(true);
  const [currentPlaceImage, setCurrentPlaceImage] = useState();
  const toggleSidebar = () => {
    setIsToggled(!isToggled);
  };
  // useEffect(() => {
  //   const fetchSpaces = async () => {
  //     try {
  //       getAllAboutPlaces().then((places) => {
  //         if (places.length > 0) {
  //           getImage(places[0].restaurant[0].image).then((res) => {
  //             setCurrentPlaceImage(res);
  //           });
  //         }
  //       });
  //     }
  //     catch (err: any) {
  //       console.error(err);
  //     }
  //   }
  //   fetchSpaces();
  // }, []);
  const boxRef = useRef(null);
  const sidebarOutsideClick = OutsideClick(boxRef);

  const sidebarMenuItems = sidebarMenuLinks
    .filter(item => !(isAdmin && item.label === "Restaurant"))
    .map((item) => {
      return (
        <li
          key={item.label}
          className={item.soon ? classes.disabled : ""}
          onClick={() => {
            if (item.label === "Edit") editPlace();
          }}
        >
          <NavLink
            to={item.to}
            className={({ isActive }) => (isActive ? classes.link_active : "")}
          >
            <div className={classes.menu_item_container}>
              <div className={classes.menu_item_icon}>
                <div className={classes.item_icon}>
                  <div className={classes.main_icon}> {item.icon}</div>
                  {item.soon && (
                    <div className={classes.soon_label}>{soonLabelIcon}</div>
                  )}
                </div>
                {!isToggled && (
                  <div className={classes.menu_item_label}>{item.label}</div>
                )}
              </div>
            </div>
          </NavLink>
        </li>
      );
    });

  useEffect(() => {
    if (sidebarOutsideClick) {
      setIsToggled(true);
    }
  }, [sidebarOutsideClick]);

  const ImageLogo = () => {
    return (
      <div
        style={{ backgroundImage: `url(${currentPlaceImage})` }}
        className={classes.business_logo}
      ></div>
    );
  };

  // Changing of the restaurant
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestautant, setSelectedRestautant] =
    useState<Restaurant | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const setSelectedAndSaveToLocalStorage = useCallback(
    async (restaurant) => {
      setSelectedRestautant(restaurant);
      localStorage.setItem("selectedRestaurant", JSON.stringify(restaurant) ?? null);
      if(restaurant){
        const SwitchToken = await putSwitchAccesToken(
          restaurant.placeId,
          restaurant.id
        );
        storage.setAccessToken(SwitchToken.accessToken);
        window.location.reload();
      }
    },
    [setSelectedRestautant]
  );

  const handleToggleButton = (
    e: React.MouseEvent<HTMLButtonElement>,
    modalIsOpen: boolean
  ) => {
    e.stopPropagation(); // Prevent the event from propagating to the outer container

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const modalWidth = 80;

    setModalPosition({
      top: buttonRect.top + buttonRect.height + 10, // 10px below the button's center
      left: buttonRect.right - modalWidth, // Right upper corner of the button
    });

    setModalIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const RestaurantResponse = await getAllCurrentPlaces();
        if (Array.isArray(RestaurantResponse)) {
          setRestaurants(RestaurantResponse);

          if (isAdmin) {
            // Для админа используем логику с placeId и restaurantId
            const adminData = await getAdminRestaurantData();
            if (adminData) {
              const restaurantData = await getRestaurantById(adminData.restaurantId);
              if (restaurantData) {
                setSelectedRestautant(restaurantData);
              }
            }
          } else {
            // Для не-админа используем существующую логику
            const selectedRestaurantFromStorage = JSON.parse(
              localStorage.getItem("selectedRestaurant") ?? "null"
            );
            if (selectedRestaurantFromStorage) {
              setSelectedRestautant(selectedRestaurantFromStorage);
            } else if (RestaurantResponse.length > 0) {
              setSelectedRestautant(RestaurantResponse[0]);
              localStorage.setItem("selectedRestaurant", JSON.stringify(RestaurantResponse[0]));
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };
    fetchData();
  }, [isAdmin]);

  const [showFullText, setShowFullText] = useState(false);

  const street = selectedRestautant?.address.split(", ")[0];

  const handleHover = () => {
    if (street && street?.length > 11) {
      setShowFullText(true);
    }
  };

  const handleLeave = () => {
    setShowFullText(false);
  };
  return (
    <div className={classes.sidebar_container}>
      <div
        ref={boxRef}
        className={`${classes.sidebar} ${
          isToggled ? classes.toggled_sidebar : ""
        }`}
      >
        <div className={classes.sidebar_header}>
          <div className={classes.header_icon}>
            {selectedRestautant === null ? (
              !isAdmin && <NavLink to="/create-place">{plusCircleIcon}</NavLink>
            ) : (
              <div className={classes.RestaurantAvatar}>
                <img
                  className={classes.RestaurantAvatarImage}
                  src={selectedRestautant?.image}
                  alt={selectedRestautant?.name}
                />
              </div>
            )}
            {!isAdmin && (
              <button
                className={classes.header_button_arrow}
                onClick={(e) => handleToggleButton(e, modalIsOpen)}
              >
                <span className={classes.header_arrow}>{arrowDownIcon}</span>
              </button>
            )}
            {modalIsOpen ? (
              <div
                className={classes.RestaurantModal}
                onMouseLeave={() => setModalIsOpen(false)}
                style={{
                  position: "fixed",
                  top: modalPosition.top + "px",
                  left: modalPosition.left + 30 + "px",
                  zIndex: 999,
                }}
              >
                <div className={classes.ModalHead}>
                  <div className={classes.HeadTitle}>
                    <span className={classes.HeadTitleText}>Your places</span>
                    <div className={classes.PlacesCount}>
                      <span className={classes.PlacesCountText}>
                        {restaurants.length}
                      </span>
                    </div>
                  </div>
                  <button
                    className={classes.CreatePlaceButton}
                    onClick={() => navigate("/create-place")}
                  >
                    <span className={classes.PlusIcon}>
                      {CreatePlacePlusIcon}
                    </span>
                    <span className={classes.CreatePlaceText}>
                      Create place
                    </span>
                  </button>
                </div>
                <div className={classes.ModalContent}>
                  <div className={classes.ModalContentList}>
                    {restaurants.map((restaurant) => (
                      <button
                        className={`${classes.RestaurantRow} ${
                          restaurant.id === selectedRestautant?.id
                            ? classes.SelectedRestaurant
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedAndSaveToLocalStorage(restaurant)
                        }
                        key={restaurant.id}
                      >
                        <div className={classes.RestaurantHead}>
                          <div className={classes.RestaurantImageContainer}>
                            <img
                              className={classes.RestaurantImage}
                              src={restaurant.image}
                              alt={restaurant.name}
                            />
                          </div>
                          <div className={classes.RestaurantContent}>
                            <span className={classes.RestaurantName}>
                              {restaurant.name}
                            </span>
                            <span className={classes.RestaurantAddress}>
                              {restaurant.address}
                            </span>
                          </div>
                        </div>
                        {restaurant.id === selectedRestautant?.id ? (
                          <span className={classes.checkedRestaurant}>
                            {checkedRestaurantIcon}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {!isToggled && (
            <div className={classes.header_title}>
              {selectedRestautant?.name}
              <span
                style={{ fontSize: 14 }}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                {selectedRestautant?.address.split(", ")[1]},
                {showFullText
                  ? selectedRestautant?.address.split(", ")[0]
                  : street && street.length > 11
                  ? street.substring(0, 9) + "..."
                  : street}
              </span>
            </div>
          )}
        </div>
        <div className={classes.sidebar_menu}>
          <ul>
            {sidebarMenuItems}
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "-15px",
              }}
              className={classes.logout_button}
              onClick={handleLogout}
            >
              <FontAwesomeIcon
                style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                icon={faSignOut}
              />
              {!isToggled && (
                <span style={{ paddingLeft: "20px", overflow: "hidden" }}>
                  Log out
                </span>
              )}
            </button>
          </ul>
        </div>
        <div className={classes.sidebar_footer}>
          <span
            className={`${classes.footer_icon} ${
              isToggled ? "" : classes.rotate
            }`}
            onClick={() => toggleSidebar()}
          >
            {doubleArrowIcon}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
