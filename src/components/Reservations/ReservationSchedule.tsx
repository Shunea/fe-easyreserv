import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  Resources,
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";

import classes from "./ReservationSchedule.module.css";
import "./ReservationSchedule.css";
import {
  checkedIcon,
  clientIcon,
  clockIcon,
  cuttleryIcon,
  moneyIcon,
  profileIcon,
  seatsIcon,
  starIcon,
  warningIcon,
  dishonoredIcon,
  serveIcon,
  canceledIcon,
  rejectedIcon,
  pendingIcon,
} from "src/icons/icons";
import { Restaurant, StoreType } from "src/Types";
import { useDispatch, useSelector } from "react-redux";
import { reservationShowComponentActions } from "src/store/reservationShowComponent";
import moment from "moment";
import { Reservation } from "../Staff/StaffTypes";
import { getClientReservation, getRestaurantById } from "src/auth/api/requests";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Typography, styled } from "@mui/material";

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
    : status === "AWAITING_PAYMENT"
    ? classes.awaiting_payment
    : "";
};

const statusIcon = (status: string | undefined) =>
  status === "PENDING" || status === "PENDING_PREORDER"
    ? pendingIcon
    : status === "CONFIRMED" || status === "CONFIRMED_PREORDER"
    ? checkedIcon
    : status === "REJECTED"
    ? rejectedIcon
    : status === "AWAITING_PAYMENT"
    ? moneyIcon
    : status === "CLOSED"
    ? moneyIcon
    : status === "SERVE" || status === "SERVE_PREORDER"
    ? serveIcon
    : status === "CANCELLED"
    ? canceledIcon
    : status === "DISHONORED"
    ? dishonoredIcon
    : null;

const resources = [
  {
    fieldName: "type",
    title: "Type",
    instances: [
      { id: "private", text: "Private" },
      { id: "work", text: "Work" },
    ],
  },
];

const ReservationSchedule = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(storedRestaurant.id);

        if (restaurantData.placeId === storedRestaurant.placeId) {
          setSelectedRestaurant(restaurantData);
        }
      } catch (error) {
        console.error("Error fetching restaurant data", error);
      }
    };
    if (storedRestaurant) {
      fetchRestaurantData();
    }
  }, []);

  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  const [reservation, setReservation] = useState<Reservation>();
  const reservationClickedReservation = useSelector(
    (state: StoreType) => state.reservationShowComponent.clickedReservation
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClientReservation(
          reservationClickedReservation.id
        );
        setReservation(response);
      } catch (error) {
        console.error("Can't get client's reservation:", error);
      }
    };
    fetchData();
  }, []);
  const avatarFileName =
    reservation?.general.waiterAvatar &&
    reservation?.general.waiterAvatar.split("/").pop();
  const contactAvatarFileName =
    reservation?.contacts.avatarUrl &&
    reservation?.contacts.avatarUrl.split("/").pop();
  const isCustomAvatar = avatarFileName && avatarFileName.startsWith("avatar_");
  const isCustomContactAvatar =
    contactAvatarFileName && contactAvatarFileName.startsWith("avatar_");

  const reservationDate = useSelector(
    (state: StoreType) => state.reservationShowComponent.date
  );
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [currentTimes, setCurrentTimes] = useState(moment().toISOString());

  const reservationCurrentTable = useSelector(
    (state: StoreType) => state.reservationShowComponent.currentTable
  );
  const filteredReservations = reservationCurrentTable.reservations.filter(
    (reservation) =>
      moment(reservation.date).isSame(moment(reservationDate), "day")
  );
  // const formattedReservation = filteredReservations.map((appointment) => ({
  //   ...appointment,
  //   startDate: appointment.startTime,
  //   endDate: appointment.endTime,
  // }));
  const formattedReservations = filteredReservations.map((appointment) => {
    let endDate = appointment.endTime; // Initialize endDate with the original endTime

    // Check if the endTime exceeds currentTime
    if (
      (appointment.status === "PENDING" ||
        appointment.status === "PENDING_PREORDER" ||
        appointment.status === "CONFIRMED" ||
        appointment.status === "CONFIRMED_PREORDER" ||
        appointment.status === "SERVE" ||
        appointment.status === "SERVE_PREORDER") &&
      moment(currentTimes).isAfter(moment(appointment.endTime))
    ) {
      endDate = currentTimes;
    } else {
      endDate = appointment.endTime;
    }
    return {
      ...appointment,
      startDate: appointment.startTime,
      endDate: endDate,
    };
  });

  const appointments: Array<AppointmentModel> = formattedReservations;
  const findOverlappingReservations = () => {
    for (let i = 0; i < appointments.length - 1; i++) {
      let x1 = moment(appointments[i].startDate).unix();
      let x2 = moment(appointments[i].endDate).unix();
      let y1 = moment(appointments[i + 1].startDate).unix();
      let y2 = moment(appointments[i + 1].endDate).unix();
      if (Math.max(x1, y1) < Math.min(x2, y2)) {
        document
          .querySelector(`#a${appointments[i].id}`)
          ?.classList.add("top_card");
        document
          .querySelector(`#a${appointments[i].id}`)
          ?.parentElement?.classList.add("top_card_container");
        document
          .querySelector(`#a${appointments[i + 1].id}`)
          ?.classList.add("bottom_card");
        document
          .querySelector(`#a${appointments[i + 1].id}`)
          ?.parentElement?.classList.add("bottom_card_container");
        document
          .querySelector(`#a${appointments[i + 1].id}`)
          ?.parentElement?.parentElement?.classList.add(
            "bottom_card_container"
          );
      }
    }
  };

  const displayReservationDetails = (reservationData: any) => {
    dispatch(
      reservationShowComponentActions.setClickedReservation(reservationData)
    );
    dispatch(reservationShowComponentActions.showDetails());
  };

  useEffect(() => {
    let root = document.querySelectorAll<HTMLElement>(":root")[0];
    root.style.setProperty("--currentTime", `'${currentTime}'`);
    setTimeout(() => {
      // get reservations
      let labels = document.querySelectorAll<HTMLElement>(".Label-text");
      let startDates = appointments.map((appointment) => {
        return moment(appointment.startDate).format("HH:mm");
      });
      labels.forEach((label) => {
        if (startDates.includes(label.innerText)) {
          label.style.setProperty("font-weight", "700");
        }
      });
      findOverlappingReservations();
    }, 200);
  });
  setInterval(function () {
    setCurrentTime(moment().format("HH:mm"));
  }, 60 * 1000);

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0)",
      maxWidth: 1000,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));
  const appointmentCard = (data) => {
    const timeDifference = moment(data.endTime).diff(
      moment(data.startTime),
      "minutes"
    );

    return timeDifference <= 35 ? (
      <HtmlTooltip
        placement="top"
        title={
          <React.Fragment>
            <div className={classes.TooltipContainer}>
              <div className={classes.Logo_RestaurantName}>
                {data.user.avatar ? (
                  <>
                    <img
                      className={classes.ClientImage}
                      src={
                        isCustomContactAvatar
                          ? require(`../../assets/${contactAvatarFileName}`)
                              .default
                          : reservation?.contacts.avatarUrl !== null
                          ? reservation?.contacts.avatarUrl
                          : DEFAULT_IMAGE
                      }
                      alt={reservation?.contacts.username}
                    />
                  </>
                ) : (
                  <div className={classes.avatar_icon}>{profileIcon}</div>
                )}
              </div>
              <div className={classes.client_details}>
                <div className={classes.client_name}>
                  {data.user ? data.user.username : ""}
                  {data.orders?.length > 0 && (
                    <span className={classes.inline_amount}>
                     {data.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0)} MDL
                    </span>
                  )}
                </div>
                <p className={classes.guest_rating}>
                  <span className={classes.seats_icon}>{seatsIcon}</span>
                  {data.guestsNumber} guests
                  {data.rating && (
                    <span className={classes.rating_icon}>
                      {starIcon} {data.rating}
                    </span>
                  )}
                </p>
              </div>
              <p>
                {data.orders?.length !== 0 && (
                  <div className={classes.order}>{cuttleryIcon}</div>
                )}
                <div
                  className={`${classes.status} ${statusStyle(data.status)}`}
                >
                  {" "}
                  {statusIcon(data.status)}
                </div>
              </p>
            </div>
          </React.Fragment>
        }
      >
        <div
          className={`${classes.appointment_card} ${statusStyle(data.status)}`}
          id={`a${data.id}`}
          onClick={() => displayReservationDetails(data)}
        >
          <div>
            <div className={classes.left_side}>
              <div className={classes.Logo_RestaurantName}>
                {data.user.avatar ? (
                  <>
                    <img
                      className={classes.ClientImage}
                      src={
                        isCustomContactAvatar
                          ? require(`../../assets/${contactAvatarFileName}`)
                              .default
                          : reservation?.contacts.avatarUrl !== null
                          ? reservation?.contacts.avatarUrl
                          : DEFAULT_IMAGE
                      }
                      alt={reservation?.contacts.username}
                    />
                  </>
                ) : (
                  <div className={classes.avatar_icon}>{profileIcon}</div>
                )}
              </div>
              <div className={classes.client_details}>
                <div className={classes.client_name}>
                  {data.user ? data.user.username : ""}
                  {data.orders?.length > 0 && (
                    <span className={classes.inline_amount}>
                     {data.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0)} MDL
                    </span>
                  )}
                </div>
                <p className={classes.guest_rating}>
                  <span className={classes.seats_icon}>{seatsIcon}</span>
                  {data.guestsNumber} guests
                  {data.rating && (
                    <span className={classes.rating_icon}>
                      {starIcon} {data.rating}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className={classes.right_side}>
              <div>
                <p className={classes.reservation_icons}>
                  {data.orders?.length !== 0 && (
                    <div className={classes.order}>{cuttleryIcon}</div>
                  )}
                  <div
                    className={`${classes.status} ${statusStyle(data.status)}`}
                  >
                    {" "}
                    {statusIcon(data.status)}
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </HtmlTooltip>
    ) : (
      <div
        className={`${classes.appointment_card} ${statusStyle(data.status)}`}
        id={`a${data.id}`}
        onClick={() => displayReservationDetails(data)}
      >
        <div>
          <div className={classes.left_side}>
            <div className={classes.Logo_RestaurantName}>
              {data.user.avatar ? (
                <>
                  <img
                    className={classes.ClientImage}
                    src={
                      isCustomContactAvatar
                        ? require(`../../assets/${contactAvatarFileName}`)
                            .default
                        : reservation?.contacts.avatarUrl !== null
                        ? reservation?.contacts.avatarUrl
                        : DEFAULT_IMAGE
                    }
                    alt={reservation?.contacts.username}
                  />
                </>
              ) : (
                <div className={classes.avatar_icon}>{profileIcon}</div>
              )}
            </div>
            <div className={classes.client_details}>
              <div className={classes.client_name}>
                {data.user ? data.user.username : ""}
                {data.orders?.length > 0 && (
                  <span className={classes.inline_amount}>
                   {data.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0)} MDL
                  </span>
                )}
              </div>
              <p className={classes.guest_rating}>
                <span className={classes.seats_icon}>{seatsIcon}</span>
                {data.guestsNumber} guests
                {data.rating && (
                  <span className={classes.rating_icon}>
                    {starIcon} {data.rating}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className={classes.right_side}>
            <div>
              <p className={classes.reservation_icons}>
                {data.orders?.length !== 0 && (
                  <div className={classes.order}>{cuttleryIcon}</div>
                )}
                <div
                  className={`${classes.status} ${statusStyle(data.status)}`}
                >
                  {" "}
                  {statusIcon(data.status)}
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Layout = ({
    setScrollingStrategy,
    dayScaleComponent,
    timeTableComponent,
    ...restProps
  }) => (
    <DayView.Layout
      resources={resources}
      setScrollingStrategy={setScrollingStrategy}
      dayScaleComponent={dayScaleComponent}
      timeTableComponent={timeTableComponent}
      {...restProps}
      className={classes.scheduler_layout}
    />
  );
  const Appointment = ({
    children,
    data,
    draggable,
    resources,
    ...restProps
  }) => (
    <Appointments.Appointment
      children={appointmentCard(data)}
      data={data}
      draggable={draggable}
      resources={resources}
      {...restProps}
      className={classes.appointment}
    />
  );

  const AppointmentContent = ({
    data,
    recurringIconComponent,
    type,
    formatDate,
    durationType,
    resources,
    ...restProps
  }) => (
    <Appointments.AppointmentContent
      {...restProps}
      type={type}
      recurringIconComponent={recurringIconComponent}
      formatDate={formatDate}
      durationType={durationType}
      resources={resources}
      data={data}
      className={classes.apptContent}
    />
  );

  return (
    <Paper>
      <Scheduler data={appointments} locale={"en-GB"}>
        <ViewState currentDate={reservationDate} />
        <DayView layoutComponent={Layout} startDayHour={1} endDayHour={24} />

        <Appointments
          appointmentComponent={Appointment}
          appointmentContentComponent={AppointmentContent}
        />
        <CurrentTimeIndicator updateInterval={60} />
        <Resources data={resources} />
      </Scheduler>
    </Paper>
  );
};

export default ReservationSchedule;
