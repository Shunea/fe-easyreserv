import React, { useEffect, useState } from "react";
import classes from "./notifications.module.css";
import {
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  SwitchProps,
  Typography,
  styled,
} from "@mui/material";
import {
  disableNotificationToken,
  editRestaurant,
  getNotificationStatus,
  getRestaurantById,
  saveNotificationToken,
} from "src/auth/api/requests";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { messaging } from "../../../firebase";
import { Restaurant } from "src/Types";
interface NotificationsProps {}
const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
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
        backgroundColor: theme.palette.mode === "dark" ? "#ffd966" : "#fe9800",
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

const Notifications: React.FC<NotificationsProps> = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [isNotificationEnabled, setIsNotificationEnabled] =
    useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const checkNotificationPermission = async () => {
    const response = await getNotificationStatus();
    const NotificationStatus = response[0].status;
    setIsNotificationEnabled(NotificationStatus === "ACTIVE");
  };
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(storedRestaurant.id);
        setIsHidden(restaurantData.isHidden);
      } catch (error) {
        console.error("Error fetching restaurant data", error);
      }
    };
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      fetchRestaurantData();
      setSelectedRestaurant(selectedRestaurantFromCookie);
    }
  }, []);
  useEffect(() => {
    checkNotificationPermission();
  }, []);
  const handleSwitchChange = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: messaging["vapidKey"],
      });
      if (token) {
        if (isNotificationEnabled) {
          const response = await disableNotificationToken();
          setIsNotificationEnabled(false);
        } else {
          const response = await saveNotificationToken(token);
          setIsNotificationEnabled(true);
        }
        checkNotificationPermission();
      }
    } catch (error) {
      console.error("Error handling notification token:", error);
    }
  };
  const handleSwitchHiddenChange = async () => {
    try {
      if (selectedRestaurant) {
        const { id: restaurantId, placeId } = selectedRestaurant;

        // Update isHidden based on the current state
        const newIsHidden = !isHidden;

        // Update the UI state immediately
        setIsHidden(newIsHidden);

        // Update the backend using the editRestaurant function
        await editRestaurant(placeId, restaurantId, { isHidden: newIsHidden });
      }
    } catch (error) {
      console.error("Error handling restaurant hidden switch:", error);
    }
  };
  return (
    <div className={classes.NotificationsContainer}>
      <h1 className={classes.h1}>Set your notifications</h1>
      <FormGroup className={classes.Notifications}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={classes.Typography}>
            Enable General Notifications
          </Typography>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={isNotificationEnabled}
                onChange={handleSwitchChange}
              />
            }
            label=""
          />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={classes.Typography}>
            Put Restaurant on Hidden
          </Typography>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={isHidden}
                onChange={handleSwitchHiddenChange}
              />
            }
            label=""
          />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={classes.Typography}>
            Email Notifications
          </Typography>
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
            label=""
          />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={classes.Typography}>
            Events and News about Restaurants
          </Typography>
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
            label=""
          />
        </Stack>
      </FormGroup>
    </div>
  );
};
export default Notifications;
