import React, { useEffect, useState } from "react";
import classes from "./Reservations.module.css";
import { StoreType } from "src/Types";
import { useSelector } from "react-redux";
import moment from "moment";
import { profileIcon, clientIcon } from "src/icons/icons";
import { getAllStaff, getAllStaffForTransport, getClientReservation } from "src/auth/api/requests";
import { Reservation } from "../Staff/StaffTypes";
const ReservationDetails = (props: {
  currentSpace: any;
  // reservationId: string;
}) => {
  const [waiterName, setWaiterName] = useState("");
  const reservationCurrentTable = useSelector(
    (state: StoreType) => state.reservationShowComponent.currentTable
  );
  const reservationClickedReservation = useSelector(
    (state: StoreType) => state.reservationShowComponent.clickedReservation
  );

  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchStaff = async (page:number) => {
      try {
        const staffList = await getAllStaffForTransport(page);

        if (Array.isArray(staffList.data)) {
          const waiter = staffList.data.find(
            (staff) => staff.id === reservationClickedReservation.waiterId
          );

          if (waiter) {
            setWaiterName(waiter.username);
          }
        } else {
          console.error("StaffList data is not an array:", staffList.data);
        }
        setTotalPages(staffList.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching staff", error);
      }
    };
    const fetchAllStaff = async () => {
      setWaiterName("");
      for (let page = 1; page <= totalPages; page++) {
        await fetchStaff(page);
      }
    };

    fetchAllStaff();
  }, [reservationClickedReservation.waiterId]);
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  const [reservation, setReservation] = useState<Reservation>();

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

  return (
    <div className={classes.reservation_details}>
      <div className={classes.general}>
        <p className={classes.label}>General</p>
        <p className={classes.item}>
          <div className={classes.item_title}>Place</div>
          <div className={classes.item_value}>{storedRestaurant.name}</div>
        </p>
        <p className={classes.item}>
          <div className={classes.item_title}>Space</div>
          <div className={classes.item_value}>{props.currentSpace.label}</div>
        </p>
        <p className={classes.item}>
          <div className={classes.item_title}>Table</div>
          <div className={classes.item_value}>
            {reservationCurrentTable.tableName}
          </div>
        </p>
        <p className={classes.item}>
          <div className={classes.item_title}>Guests</div>
          <div className={classes.item_value}>
            {reservationClickedReservation.occupiedSeats}
            <span
              className={classes.seats_nr}
            >{` / ${reservationCurrentTable.seats}`}</span>
          </div>
        </p>
        <p className={classes.item}>
          <div className={classes.item_title}>Date & time</div>
          <div className={classes.item_value}>
            {moment(reservationClickedReservation.startDate).format(
              "DD MMMM YYYY, HH:mm"
            )}
          </div>
        </p>
        <p className={classes.item}>
          <div className={classes.item_title}>Waiter</div>
          <div className={classes.item_value}>
            <img
              className={classes.ClientImage}
              src={
                isCustomAvatar
                  ? require(`../../assets/${avatarFileName}`).default
                  : reservation?.general.waiterAvatar !== null
                  ? reservation?.general.waiterAvatar
                  : DEFAULT_IMAGE
              }
              alt={reservation?.general.waiterName}
            />
            <div className={classes.underlined}></div>
            {reservation?.general.waiterName}
          </div>
        </p>
      </div>
      {reservationClickedReservation.orders &&
        reservationClickedReservation.orders.length !== 0 && (
          <div className={classes.order}>
            <p className={classes.label}>Preorder</p>
            {reservationClickedReservation.orders.map((item: any) => {
              // Adjust 'any' to match your item type
              return (
                <p className={classes.item} key={item.id}>
                  <div className={classes.item_title}>
                    <span className={classes.meal_title}>{item.title}</span> x
                    {item.quantity}
                  </div>
                  <div className={classes.item_value}>{item.price} MDL</div>
                </p>
              );
            })}
            <div className={classes.order_total}>
              <div className={classes.item_title}>Total</div>
              <div className={`${classes.item_value} ${classes.meals_total}`}>
                {reservationClickedReservation.orders
                  .map((meal) => {
                    return +meal.price * meal.quantity;
                  })
                  .reduce((prev, curr) => {
                    return prev + curr;
                  })}
                MDL
              </div>
            </div>
          </div>
        )}
      <div className={classes.contacts}>
        <p className={classes.label}>Contacts</p>
        <p className={classes.item}>
          <div className={classes.item_title}>Full name</div>
          <div className={classes.item_value}>
            <img
              className={classes.ClientImage}
              src={
                isCustomContactAvatar
                  ? require(`../../assets/${contactAvatarFileName}`).default
                  : reservation?.contacts.avatarUrl !== null
                  ? reservation?.contacts.avatarUrl
                  : DEFAULT_IMAGE
              }
              alt={reservation?.contacts.username}
            />
            <div className={classes.underlined}></div>
            {reservation?.contacts.username}
          </div>
        </p>
        <p className={classes.item}>
          <div className={classes.item_title}>Phone number</div>
          <div className={classes.item_value}>
            {reservationClickedReservation.user.phoneNumber}
          </div>
        </p>
      </div>
    </div>
  );
};

export default ReservationDetails;
