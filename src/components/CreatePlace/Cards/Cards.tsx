import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import classes from "./Cards.module.css";
import {
  beautySalonIcon,
  carWashIcon,
  lockIcon,
  officeIcon,
  hotelIcon,
  restaurantIcon,
} from "../../../icons/icons";
import Row from "react-bootstrap/esm/Row";
import { useDispatch, useSelector } from "react-redux";
import { createPlaceFormDataActions } from "../../../store/formData";
import Button from "../../../UI/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Title from "../../Title";
import { StoreType } from "src/Types";
import { getAuthenticatedUser } from "src/auth/api/requests";
import {
  FormControlLabel,
  Stack,
  Switch,
  SwitchProps,
  Typography,
  styled,
} from "@mui/material";
import ImagesGallery from "../Images Gallery/ImagesGallery";
import { AuthenticatedUser } from "src/auth/types";

type Business = {
  title: string;
  icon: any;
  available: boolean;
  locked: boolean;
};
let businesses: Business[] = [
  {
    title: "RESTAURANT",
    icon: restaurantIcon,
    available: true,
    locked: false,
  },
  {
    title: "HOTEL",
    icon: hotelIcon,
    available: true,
    locked: false,
  },
  {
    title: "BEAUTY_SALON",
    icon: beautySalonIcon,
    available: false,
    locked: true,
  },
  {
    title: "OFFICE",
    icon: officeIcon,
    available: false,
    locked: true,
  },
  {
    title: "CAR_WASH",
    icon: carWashIcon,
    available: false,
    locked: true,
  },
  {
    title: "More to come soon",
    icon: lockIcon,
    available: false,
    locked: false,
  },
];

type ImagesGalleryProps = {
  isSamePlace: boolean;
  isSwitchEnabled: boolean;
};
const Cards = (props: { isEditPlace?: boolean }) => {
  const dispatch = useDispatch();
  const placeType = useSelector(
    (state: StoreType) => state.formData.place.type
  );
  const placeName = useSelector(
    (state: StoreType) => state.formData.place.name
  );
  const location = useLocation();
  const navigate = useNavigate();
  const isEditPlace = props.isEditPlace && location.pathname === "/edit-place";
  const [isSamePlace, setIsSamePLace] = useState(false);
  const [isSwitchEnabled, setIsswitchEnabled] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(null);
  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#ffd966" : "#fe9800",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await getAuthenticatedUser();
      // Check if both restaurantId and placeId are not dummy IDs
      const isDummyIds =
        authenticatedUser?.restaurantId ===
          "00000000-0000-0000-0000-000000000000" &&
        authenticatedUser?.placeId === "00000000-0000-0000-0000-000000000000";
      // Set the switch state based on the condition
      setIsSamePLace(isDummyIds ? false : true);
      setAuthenticatedUser(authenticatedUser);
      localStorage.setItem("isSamePlace", isDummyIds ? "false" : "true");
    };
    fetchUser();
  }, []);
  useEffect(() => {
    localStorage.setItem("isSwitchEnabled", isSwitchEnabled ? "true" : "false");
  }, [isSwitchEnabled]);
  useEffect(() => {
    if (placeType !== "") {
      const cards: any = document.querySelectorAll(`.${classes.card}`);
      cards.forEach((element: any) => {
        if (element.getAttribute("title") === placeType) {
          element.classList.add(classes.selectedcard);
        }
      });
    }
  }, [isEditPlace]);
  const selectCard = (event: any, key: any): any => {
    if (!event.currentTarget.classList.contains(classes.unavailable)) {
      const cards = document.querySelectorAll(`.${classes.card}`);
      cards.forEach((element) => {
        element.classList.remove(classes.selectedcard);
      });
      event.currentTarget.classList.toggle(classes.selectedcard);
      dispatch(createPlaceFormDataActions.setPlaceType(key));
    }
  };

  const title = isEditPlace
    ? `Edit your ${placeType === undefined ? "" : placeType} - ${placeName}`
    : "Create a new business";
  const subtitle = isEditPlace
    ? "Let's start by editing the business type"
    : "Let's start by choosing the business type";
  return (
    <div>
      <Title title={title} subtitle={subtitle} />
      <Row className={classes.card_content}>
        {businesses.map((business: Business) => (
          <Card
            className={`${classes.card} ${
              !business.available ? classes.unavailable : ""
            } `}
            onClick={(event) => selectCard(event, business.title)}
            key={business.title}
            title={business.title}
          >
            <Card.Body className={classes.cardbody}>
              {business.locked && (
                <div className={classes.locked}>{lockIcon}</div>
              )}
              <span className={classes.cardicon}>{business.icon}</span>
              <Card.Title
                className={`${classes.cardtitle} ${
                  !business.available ? classes.unavailable : ""
                }`}
              >
                {business.title.charAt(0) +
                  business.title.replaceAll("_", " ").toLowerCase().slice(1)}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
        {isSamePlace && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography className={classes.Typography}>
              Face parte din aceeasi retea de localuri curente
              {/* Afacerea dată face parte din rețeaua localului curent ”denumirea companiei”? (dacă are restaurant (business selectat) atunci apare acest mesaj. - Mesajul ăsta apare numai după ce o apărut un business (MIȘA) */}
            </Typography>
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  defaultChecked={isSwitchEnabled}
                  onChange={() => setIsswitchEnabled(!isSwitchEnabled)}
                />
              }
              label=""
            />
          </Stack>
        )}
      </Row>
      <div className={classes.button_container}>
        <Link to={"/create-place/plans"}>
          <Button
            text="Save & Continue"
            disabled={placeType === "" ? true : false}
          />
        </Link>
      </div>
    </div>
  );
};
export default Cards;
