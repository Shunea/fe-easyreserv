import React, { useEffect, useState } from "react";
import classes from "./Contacts.module.css";
import Title from "../../Title";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../UI/Input";
import useInput from "../../../hooks/use-input";
import { Col, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import { markerInputIcon } from "../../../icons/icons";
import { createPlaceFormDataActions } from "../../../store/formData";
import useMask from "../../../hooks/use-mask";
import { StoreType } from "../../../Types";
import SimpleSelect from "src/UI/SimpleSelect";
import Select from "src/UI/Select";
import { contactsStyle, defaultStyle } from "src/UI/selectStyles";
import { getAddressesHints, getRestaurantById } from "src/auth/api/requests";
import GoogleMapReact from "google-map-react";
import Map from "./Map";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
const Contacts = (props: { isEditPlace?: boolean }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isEditPlace =
    props.isEditPlace && location.pathname === "/edit-place/contacts";
  const isNotEmpty = (value: string) => value.trim() !== "";
  const isEmail = (value: string) => value.trim() !== "" && value.includes("@");
  const navigate = useNavigate();
  // const {
  //   value: enteredPhoneNumber,
  //   hasError: phoneNumberInputHasError,
  //   isValid: enteredPhoneNumberIsValid,
  //   valueChangeHandler: phoneNumberChangedHandler,
  //   inputBlurHandler: phoneNumberBlurHandler,
  //   saveEnteredValue: savePhoneNumberEnteredValue,
  // } = useInput(isNotEmpty, "");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const [enteredPhoneNumberIsValid, setEnteredPhoneNumberIsValid] =
    useState(false);
  useEffect(() => {
    isEditPlace ? setEnteredPhoneNumberIsValid(true) : setEnteredPhoneNumberIsValid(false);
  }, [isEditPlace]);
  
  const handleChange = (value) => {
    setEnteredPhoneNumber(value);
    setEnteredPhoneNumberIsValid(validatePhoneNumber(value));
  };
  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };
  const {
    value: enteredEmailAddress,
    hasError: emailAddressInputHasError,
    isValid: enteredEmailAddressIsValid,
    valueChangeHandler: emailAddressChangedHandler,
    inputBlurHandler: emailAddressBlurHandler,
    saveEnteredValue: saveEmailAddressEnteredValue,
  } = useInput(isEmail, "");

  const {
    value: enteredLocation,
    hasError: locationInputHasError,
    isValid: enteredLocationIsValid,
    valueChangeHandler: locationChangedHandler,
    inputBlurHandler: locationBlurHandler,
    saveEnteredValue: saveLocationEnteredValue,
  } = useInput(isNotEmpty, "");
  const enteredLocationFromRedux = useSelector(
    (state: StoreType) => state.formData.location
  );
  const enteredPhoneNumberFromRedux = useSelector(
    (state: StoreType) => state.formData.phoneNumber
  );
  const enteredSectorFromRedux = useSelector(
    (state: StoreType) => state.formData.sector
  );
  const enteredLatFromRedux = useSelector(
    (state: StoreType) => state.formData.lat
  );
  const enteredLngFromRedux = useSelector(
    (state: StoreType) => state.formData.lng
  );
  const enteredEmailAddressFromRedux = useSelector(
    (state: StoreType) => state.formData.email
  );
  const enteredPlaceTypeFromRedux = useSelector(
    (state: StoreType) => state.formData.place.type
  );

  // const [enteredLocation, setEnteredLocation] = useState(enteredLocationFromRedux)
  // const [addressesOptions, setAddressesOptions] = useState([]);
  // const handleSelectChange = (selected: any) => {
  //   setEnteredLocation(selected);
  //   dispatch(createPlaceFormDataActions.setLocation(selected));

  // }
  const [selectedRestaurant, setSelectedRestaurant] = useState();

  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(storedRestaurant.id);

        if (restaurantData.placeId === storedRestaurant.placeId) {
          setSelectedRestaurant(restaurantData);
          const { address, phoneNumber, email, sector, lat, lng } = restaurantData;
          
          if (lat && lng) {
            setMarkerLat(lat);
            setMarkerLong(lng);
            setMarkers({ lat, lng });
            // Получаем адрес по сохраненным координатам
            await getAddressFromCoordinates(lat, lng);
          }
          
          saveEmailAddressEnteredValue(email);
          setEnteredPhoneNumber(phoneNumber);
          setEnteredSector({
            label: sector,
            value: sector,
          });
        }
      } catch (error) {
        console.error("Error fetching restaurant data", error);
      }
    };

    if (isEditPlace && storedRestaurant) {
      fetchRestaurantData();
    }
  }, [isEditPlace]);

  let formIsValid = false;

  if (
    // enteredLocation.length !== 0 &&
    enteredEmailAddressIsValid &&
    enteredPhoneNumberIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = (event: Event) => {
    if (!formIsValid) {
      return;
    }
    
    // Проверяем наличие сектора перед отправкой
    if (!enteredSector || !enteredSector.value) {
      toast.error("Please select a sector");
      return;
    }

    // Форматируем номер телефона, добавляя + только если его еще нет
    const formattedPhoneNumber = enteredPhoneNumber.startsWith('+') 
      ? enteredPhoneNumber 
      : `+${enteredPhoneNumber}`;

    // Проверяем наличие адреса перед сохранением
    if (markerAddress) {
      dispatch(createPlaceFormDataActions.setLocation(markerAddress));
    } else {
      console.warn('No address selected');
      return;
    }
    
    dispatch(createPlaceFormDataActions.setEmail(enteredEmailAddress));
    dispatch(createPlaceFormDataActions.setPhoneNumber(formattedPhoneNumber));
    dispatch(createPlaceFormDataActions.setLat(markerLat));
    dispatch(createPlaceFormDataActions.setLng(markerLong));
    dispatch(createPlaceFormDataActions.setSector(enteredSector));
  };
  // const { onInput, onKeyDown } = useMask.phoneNumber();
  // const onTypingLocation = (enteredInput: string) => {
  //   // setEnteredLocation(enteredInput);
  //   if (enteredInput.length !== 0) {
  //     getAddressesHints(enteredInput).then((res) => {
  //       let formattedAddresses = res.map((address) => {
  //         return { label: address.address, value: address.city };
  //       });
  //       setAddressesOptions(formattedAddresses);
  //     });
  //   }
  // };
  const preferedCountries = ["md", "ro", "ae", "il", "it", "si"];
  const selectedPlaceType =
    enteredPlaceTypeFromRedux === undefined ? "" : enteredPlaceTypeFromRedux;
  const title = "Contacts";
  const subtitle = isEditPlace
    ? `Edit contacts of the ${selectedPlaceType
        .toLowerCase()
        .replaceAll("_", " ")}`
    : `Provide contacts of the ${selectedPlaceType
        .toLowerCase()
        .replaceAll("_", " ")}`;

  const defaultProps = {
    center: {
      lat: 47.0277739,
      lng: 28.837012,
    },
    zoom: 15,
  } as const;

  interface Coordinates {
    lat: number;
    lng: number;
  }

  const [markerLat, setMarkerLat] = useState<number>(defaultProps.center.lat);
  const [markerLong, setMarkerLong] = useState<number>(defaultProps.center.lng);
  const [markers, setMarkers] = useState<Coordinates>({
    lat: defaultProps.center.lat,
    lng: defaultProps.center.lng
  });

  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
  };
  const sectorOptions = [
    { label: "Ciocana", value: "Ciocana" },
    { label: "Rîșcani", value: "Rîșcani" },
    { label: "Buiucani", value: "Buiucani" },
    { label: "Botanica", value: "Botanica" },
    { label: "Centru", value: "Centru" },
    { label: "Other", value: "Other" },
  ];
  const Marker = (props) => {
    return (
      <div style={{ height: "63px", marginTop: "-63px" }}>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="63"
            viewBox="0 0 46 63"
            fill="none"
          >
            <path
              d="M23.51 51.523C23.5041 51.6516 23.4488 51.7729 23.3557 51.8618C23.2625 51.9506 23.1387 52.0001 23.01 52C22.72 52 22.5 51.79 22.49 51.523C22.345 48.355 20.734 46.306 17.658 45.376C7.53 42.968 0 33.863 0 23C0 10.297 10.297 0 23 0C35.703 0 46 10.297 46 23C46 33.863 38.47 42.968 28.342 45.376C25.266 46.306 23.655 48.356 23.512 51.523H23.51Z"
              fill="#FE9800"
            />
            <path
              d="M23 63C20.79 63 19 61.21 19 59C19 56.79 20.79 55 23 55C25.21 55 27 56.79 27 59C27 61.21 25.21 63 23 63Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M23.0002 61C23.2665 61.006 23.5314 60.9588 23.7792 60.861C24.027 60.7633 24.2528 60.617 24.4434 60.4308C24.6339 60.2446 24.7853 60.0222 24.8887 59.7766C24.9921 59.5311 25.0453 59.2674 25.0454 59.001C25.0455 58.7346 24.9923 58.4708 24.8891 58.2253C24.7858 57.9797 24.6345 57.7572 24.4441 57.5709C24.2537 57.3846 24.0279 57.2382 23.7801 57.1403C23.5324 57.0425 23.2675 56.9951 23.0012 57.001C22.4786 57.0125 21.9814 57.2282 21.6158 57.6018C21.2503 57.9754 21.0455 58.4773 21.0454 59C21.0453 59.5227 21.2498 60.0246 21.6151 60.3984C21.9805 60.7722 22.4776 60.9882 23.0002 61Z"
              fill="#FE9800"
            />
          </svg>
        </div>
        <div style={{ marginLeft: "11px", marginTop: "-52px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clip-path="url(#clip0_63_1582)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.6 10C19.533 12 18 13 16 13C14 13 12.467 12 11.4 10L11.776 0.6C11.7822 0.4387 11.8507 0.286081 11.967 0.1742C12.0834 0.0623188 12.2386 -0.000119265 12.4 1.71033e-07H12.81C12.8614 -6.40613e-05 12.9108 0.0196292 12.948 0.0550001C12.9852 0.0903711 13.0074 0.138709 13.01 0.19L13.35 7H15.05L15.39 0.19C15.3926 0.138709 15.4148 0.0903711 15.452 0.0550001C15.4892 0.0196292 15.5386 -6.40613e-05 15.59 1.71033e-07H16.41C16.4614 -6.40613e-05 16.5108 0.0196292 16.548 0.0550001C16.5852 0.0903711 16.6074 0.138709 16.61 0.19L16.95 7H18.65L18.99 0.19C18.9926 0.138709 19.0148 0.0903711 19.052 0.0550001C19.0892 0.0196292 19.1386 -6.40613e-05 19.19 1.71033e-07H19.6C19.935 1.71033e-07 20.21 0.265 20.224 0.6L20.6 10ZM17.11 13.854L17.37 22.971C17.3739 23.1046 17.3509 23.2376 17.3025 23.3621C17.2542 23.4867 17.1813 23.6003 17.0883 23.6962C16.9952 23.7921 16.8839 23.8684 16.7609 23.9206C16.6379 23.9728 16.5056 23.9998 16.372 24H15.63C15.4962 24.0001 15.3638 23.9733 15.2405 23.9212C15.1172 23.8691 15.0057 23.7929 14.9124 23.6969C14.8192 23.601 14.7461 23.4873 14.6976 23.3626C14.6491 23.2379 14.6261 23.1047 14.63 22.971L14.89 13.854C15.26 13.952 15.631 14 16.001 14C16.371 14 16.74 13.951 17.11 13.854ZM9 1.055V24H8.282C8.01257 24.0001 7.7459 23.9457 7.498 23.8402C7.2501 23.7347 7.02608 23.5801 6.83939 23.3859C6.65269 23.1916 6.50717 22.9616 6.41156 22.7097C6.31595 22.4578 6.27222 22.1892 6.283 21.92L6.6 14C6.2 12.96 5.333 12.294 4 12C4 6.678 5.085 2.807 7.256 0.388C7.39114 0.237525 7.56873 0.131564 7.76534 0.0841028C7.96194 0.0366414 8.16831 0.0499105 8.35722 0.122159C8.54613 0.194407 8.70869 0.322238 8.82344 0.488781C8.9382 0.655324 8.99976 0.852749 9 1.055Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_63_1582">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  const handleMapChange = ({ center, zoom, bounds, marginBounds }: {
    center: Coordinates;
    zoom: number;
    bounds: any;
    marginBounds: any;
  }) => {
    if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
      console.warn('Invalid map center:', center);
      return;
    }

    const newLat = Number(center.lat);
    const newLng = Number(center.lng);
    
    if (isNaN(newLat) || isNaN(newLng)) {
      console.warn('Invalid coordinates:', { newLat, newLng });
      return;
    }

    setMarkerLat(newLat);
    setMarkerLong(newLng);
    setMarkers({ lat: newLat, lng: newLng });
    
    const timeoutId = setTimeout(() => {
      getAddressFromCoordinates(newLat, newLng);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleMapClick = ({ lat, lng }: Coordinates) => {
    setMarkerLat(lat);
    setMarkerLong(lng);
    setMarkers({ lat, lng });
    getAddressFromCoordinates(lat, lng);
  };

  // let markersList = markers.map((marker, index) => {
  //   return (
  //     <Marker position={marker} key={index} name={index} />
  //   )
  // });
  const [enteredSector, setEnteredSector] = useState(sectorOptions[0]);
  const handleSelectChange = (selected: any) => {
    setEnteredSector(selected);
    dispatch(createPlaceFormDataActions.setSector(selected));
  };
  // const handleChangeMarker = (selected: any) => {
  //   console.log(selected)
  //   setMarkers({lat:selected.lat, lng:selected.lng});
  // };
  // useEffect (() => {
  //   setMarkerLat(markers.lat);
  //   setMarkerLong(markers.lng);
  //   console.log(markerLat, markerLong)
  // },[markerLat, markerLong, markers]);

  // Добавьте новое состояние для адреса
  const [markerAddress, setMarkerAddress] = useState("");

  // Функция для получения адреса по координатам
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    // Добавляем проверку на валидные координаты
    if (!lat || !lng) {
      console.warn('Invalid coordinates:', { lat, lng });
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBm91ihkYfRniRWTYXDNgcOOdORZkE8WxA`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.results && data.results[0]) {
        const address = data.results[0].formatted_address;
        setMarkerAddress(address);
        saveLocationEnteredValue(address);
      } else {
        console.warn('No address found for coordinates:', { lat, lng });
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  return (
    <div className={classes.contacts}>
      <Title title={title} subtitle={subtitle} />
      <form>
        {/* <Row>
          <Col className={classes.location_input}>
            <span className={classes.input_icon}>{markerInputIcon}</span>
            <Input
              className={classes.input_location}
              label="Location"
              value={enteredLocation}
              placeholder={"Enter full address"}
              onChange={locationChangedHandler}
              onBlur={locationBlurHandler}
            />
            <SimpleSelect
              label="Location"
              value={enteredLocation}
              options={addressesOptions}
              placeholder={'Enter full address'}
              onChange={handleSelectChange}
              onInputChange={onTypingLocation}
              styles={contactsStyle}
            />
          </Col>
        </Row> */}
        <Row className={classes.map_container}>
          <Col>
            <div className={classes.map}>
              {/* <Map /> */}
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyBm91ihkYfRniRWTYXDNgcOOdORZkE8WxA"
                }}
                defaultCenter={defaultProps.center}
                center={markers}
                defaultZoom={defaultProps.zoom}
                disableDefaultUI={true}
                options={{
                  panControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControl: false,
                  keyboardShortcuts: false,
                }}
                onChange={handleMapChange}
                onClick={handleMapClick}
                yesIWantToUseGoogleMapApiInternals
                // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
              >
                <Marker lat={markers.lat} lng={markers.lng} />
              </GoogleMapReact>
            </div>
            {markerAddress && (
              <div className={classes.address_display}>
                <p>
                  <strong>Selected address:</strong> {markerAddress}
                </p>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            {/* <Input
              onInput={onInput}
              onKeyDown={onKeyDown}
              label="Phone number"
              value={enteredPhoneNumber}
              hasError={phoneNumberInputHasError}
              errorMessage="Value must not be empty"
              type="text"
              onChange={phoneNumberChangedHandler}
              onBlur={phoneNumberBlurHandler}
            />*/}
            <label
              style={{
                display: "flex",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "5px",
              }}
              htmlFor="phoneNumber"
            >
              Phone number
            </label>
            <PhoneInput
              country={"md"}
              countryCodeEditable={false}
              placeholder="Enter phone number"
              containerClass={classes.PhoneContainer}
              inputClass={classes.PhoneInput}
              dropdownClass={classes.PhoneDropDown}
              value={enteredPhoneNumber}
              preferredCountries={preferedCountries}
              onChange={handleChange}
              buttonClass={classes.PhoneButton}
              inputProps={{
                required: true,
              }}
            />
            {!enteredPhoneNumberIsValid && (
              <p
                style={{
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "red",
                  opacity: "0.4",
                }}
              >
                Value must not be empty
              </p>
            )}
          </Col>
          <Col>
            <Input
              placeholder="Enter e-mail address"
              label="E-mail address"
              value={enteredEmailAddress}
              hasError={emailAddressInputHasError}
              errorMessage="Value must not be empty"
              type="email"
              onChange={emailAddressChangedHandler}
              onBlur={emailAddressBlurHandler}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <SimpleSelect
              label="Sector"
              value={enteredSector}
              onChange={handleSelectChange}
              styles={defaultStyle}
              placeholder={"Sector"}
              options={sectorOptions}
            />
          </Col>
        </Row>
        <div className={classes.form_buttons}>
          <Link
            to={{
              pathname: isEditPlace
                ? "/edit-place/images"
                : "/create-place/images",
            }}
          >
            <Button
              text="Save & Continue"
              disabled={!formIsValid}
              type="submit"
              onClick={submitHandler}
            />
          </Link>
          <Link
            to={{
              pathname: isEditPlace
                ? "/edit-place/create"
                : "/create-place/create",
            }}
          >
            <Button text="Back" type={"button"} secondary={true} />
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Contacts;
