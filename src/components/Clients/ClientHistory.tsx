import classes from "./ClientHistory.module.css";
import { useEffect, useRef, useState } from "react";
import { getClientHistory } from "../../auth/api/requests";
import { Client } from "../Staff/StaffTypes";
import {
  badReview,
  closeIcon,
  goodReview,
  guestsIcon,
  ratingIcon,
  ReservationDetailsLinkIcon,
  ViewReservationIcon,
} from "../../icons/icons";
import SimpleSelect from "../../UI/SimpleSelect";
import dayjs from "dayjs";
import DetailsClients from "./DetailsClients";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";

type Props = { clientId: string; handleClose: () => void };
const ClientHistory = ({ clientId, handleClose }: Props) => {
  let feedOptions = [
    { value: "all", label: "All types of feedback" },
    { value: "good", label: "All good feedback" },
    { value: "bad", label: "All bad feedback" },
  ];
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  const [enteredFeed, setEnteredFeed] = useState(feedOptions[0]);
  const handleSelectChange = (selected: any) => {
    setEnteredFeed(selected);
  };

  const [client, setClient] = useState<Client>();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getClientHistory(clientId, enteredFeed.value);
        setClient(response);
      } catch (error) {
        console.error("Can't get client:", error);
      }
    };
    fetchClient();
  }, [clientId, enteredFeed]);

  const [selectedReservation, setSelectedReservation] = useState("");
  const [displayReservationDetails, setDisplayReservationDetails] =
    useState(false);
  const handleDisplayReservationsDetails = (reservetionId) => {
    setDisplayReservationDetails((prevState) => !prevState);
    setSelectedReservation(reservetionId);
  };

  const BoxRef = useRef<HTMLDivElement | null>(null);

  if (displayReservationDetails) {
    return (
      <DetailsClients
        reservationId={selectedReservation}
        onBack={() => handleDisplayReservationsDetails("")}
        onClose={() => handleClose()}
      />
    );
  }
  const avatarFileName = client?.avatar && client.avatar.split("/").pop();
  const isCustomAvatar = avatarFileName && avatarFileName.startsWith("avatar_");

  return (
    <div className={classes.modal}>
      <div className={classes.box} ref={BoxRef}>
        <OutsideClickHandler innerRef={BoxRef} onClose={handleClose} />
        <div className={classes["title-container"]}>
          <div className={classes.title}>
            <img
              src={
                isCustomAvatar
                  ? require(`../../assets/${avatarFileName}`).default
                  : client?.avatar !== null
                  ? client?.avatar
                  : DEFAULT_IMAGE
              }
              alt={client?.username}
              className={classes.avatarImage}
            />
            <div className={classes.heading1}>{client?.username}</div>
          </div>
          <div className={classes.closeIcon} onClick={() => handleClose()}>
            {closeIcon}
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes["content-2"]}>
            <div className={classes["div-3"]}>
              <div className={classes["label-wrapper"]}>
                <div className={classes["label-3"]}>Reservations history</div>
                <div className={classes.item13}>
                  <div className={classes.item14}>Total:</div>
                  <div className={classes.text2}>
                    {client?.reservationsTotal}
                  </div>
                  <div className={classes.item15}>MDL</div>
                </div>
              </div>
              <div className={classes.list}>
                {client?.reservations.map((reservation) => (
                  <div className={classes.card}>
                    <div className={classes.labelwrapper}>
                      <div className={classes.label3}>
                        <p className={classes.p}>
                          <span className={classes.span}>
                            {dayjs(reservation.date).format("DD MMMM YYYY")}
                          </span>
                          <span className={classes.textwrapper2}>
                            , {reservation.type}
                          </span>
                        </p>
                        <div className={classes.caption}>
                          <div className={classes.div3}>
                            {guestsIcon}
                            <div className={classes.caption2}>
                              {reservation.guestsNumber}{" "}
                              {reservation.guestsNumber > 1
                                ? "guests"
                                : "guest"}
                            </div>
                          </div>
                          <div className={classes.div3}>
                            {ratingIcon}
                            <div className={classes.caption2}>
                              {reservation.serviceRating}
                            </div>
                          </div>
                          <div className={classes.tag}>
                            <div className={classes.label4}>
                              <img
                                className={classes.waiterImage}
                                src={
                                  reservation.waiterAvatar &&
                                  reservation.waiterAvatar
                                    .split("/")
                                    .pop()
                                    ?.startsWith("avatar_")
                                    ? require(`../../assets/${reservation?.waiterAvatar
                                        .split("/")
                                        .pop()}`).default
                                    : reservation?.waiterAvatar !== null
                                    ? reservation?.waiterAvatar
                                    : DEFAULT_IMAGE
                                }
                                alt={reservation.waiterName}
                              />
                            </div>
                          </div>
                          <div className={classes.waiterUsername}>
                            {reservation.waiterName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={classes.item16}>
                      <div className={classes.text3}>{reservation.price}</div>
                      <div className={classes.item15}>MDL</div>
                    </div>
                    <button
                      className={classes.button2}
                      onClick={() =>
                        handleDisplayReservationsDetails(reservation.id)
                      }
                    >
                      <div className={classes.text4}>Details</div>
                      {ReservationDetailsLinkIcon}
                    </button>
                  </div>
                ))}
              </div>
              {client?.reservations ? (
                <div className={classes.container}>
                  <div className={classes.button3}>
                    {ViewReservationIcon}
                    <div className={classes.label5}>View all reservations</div>
                  </div>
                </div>
              ) : null}

              <div className={classes.section}>
                <div className={classes.label}>
                  <div className={classes["label-3"]}>Feedback</div>
                  <div className={classes.frame}>
                    <div className={classes.item18}>Show:</div>
                    <SimpleSelect
                      value={enteredFeed}
                      options={feedOptions}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
              </div>
              <div className={classes.list2}>
                {client?.reviews &&
                  client?.reviews.map((review) => (
                    <div
                      className={classes.card2}
                      style={{
                        backgroundColor:
                          Number(review.rating) > 3 ? "#74e57226" : "#f2363626",
                      }}
                    >
                      <div className={classes.head3}>
                        <div className={classes.div2}>
                          <img
                            className={classes.avatar5}
                            alt={review.restaurantName}
                            src={review.restaurantImage}
                          />
                          <div className={classes.title3}>
                            {review.restaurantName}
                          </div>
                          <div className={classes.mark}>
                            <span className={classes.ReviewIcon}>
                              {Number(review.rating) > 3
                                ? goodReview
                                : badReview}
                            </span>
                          </div>
                        </div>
                        <div className={classes.date}>
                          {dayjs(review.date).format("DD.MM.YYYY")}
                        </div>
                      </div>
                      <p className={classes.value2}>{review.message}</p>
                    </div>
                  ))}
                {client?.reviews && client?.reviews?.length > 0 ? (
                  <div className={classes.container}>
                    <div className={classes.button3}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M4.89995 5.59961H12.1M4.89995 8.79961H9.69995M8.49995 12.7996H11.3C13.5091 12.7996 15.3 11.0088 15.3 8.79961V5.59961C15.3 3.39047 13.5091 1.59961 11.3 1.59961H5.69995C3.49081 1.59961 1.69995 3.39047 1.69995 5.59961V9.59961C1.69995 11.3669 3.13264 12.7996 4.89995 12.7996V12.7996V15.1996L8.49995 12.7996Z"
                          stroke="#FE9800"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className={classes.label5}>View all reviews</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientHistory;
