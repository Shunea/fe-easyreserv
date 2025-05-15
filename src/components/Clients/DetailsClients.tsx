import React, { useEffect, useRef, useState } from "react";
import { closeIcon, LeftArrow, uploadIcon } from "src/icons/icons";
import classes from "./DetailsClients.module.css";
import { getClientReservation } from "../../auth/api/requests";
import { Reservation } from "../Staff/StaffTypes";
import dayjs from "dayjs";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";

// Update this import path
type DetailsClientsProps = {
  reservationId: string;
  onBack: () => void;
  onClose: () => void;
};

const DetailsClients: React.FC<DetailsClientsProps> = ({
  reservationId,
  onClose,
  onBack,
}) => {
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  const [reservation, setReservation] = useState<Reservation>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClientReservation(reservationId);
        setReservation(response);
      } catch (error) {
        console.error("Can't get client's reservation:", error);
      }
    };
    fetchData();
  }, [reservationId]);

  // const formatPhoneNumber = (number) => {
  //   if (typeof number === "string" && number.match(/^\d+$/)) {
  //     return (
  //       "+" +
  //       number.slice(0, 3) +
  //       " " +
  //       number.slice(3, 5) +
  //       " " +
  //       number.slice(5, 8) +
  //       " " +
  //       number.slice(8)
  //     );
  //   } else {
  //     console.error("Invalid phone number format.");
  //   }
  // };
  const formatPhoneNumber = (number) => {
    if (typeof number === "string" && number.match(/^\+?\d+$/)) {
      // Remove the '+' sign for formatting, then add it back.
      const cleanedNumber = number.startsWith("+") ? number.slice(1) : number;
      return (
        "+" +
        cleanedNumber.slice(0, 3) +
        " " +
        cleanedNumber.slice(3, 5) +
        " " +
        cleanedNumber.slice(5, 8) +
        " " +
        cleanedNumber.slice(8)
      );
    } else {
      console.error("Invalid phone number format.");
    }
  };


  const BoxRef = useRef<HTMLDivElement | null>(null);

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
    <div className={classes.modal}>
      <div className={classes.box} ref={BoxRef}>
        <OutsideClickHandler innerRef={BoxRef} onClose={onClose} />
        <div className={classes.AddVacationHead}>
          <div className={classes.HeadHeading}>
            <button className={classes.BackButton} onClick={onBack}>
              {LeftArrow}
            </button>
            <div>
              <span className={classes.HeadingTitle}>Reservation </span>
              <span className={classes.ReservationNumber}>
                #{reservation?.reservationNumber}
              </span>
            </div>
          </div>
          <div className={classes.HeadActions}>
            <button className={classes.CloseButton} onClick={onClose}>
              {closeIcon}
            </button>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.content}>
            <div className={classes.list}>
              <div className={classes.section}>
                <div className={classes.label_wrapper}>
                  <div className={classes.div}>General</div>
                </div>
                <div className={classes.list2}>
                  <div className={classes.row}>
                    <div className={classes.label2}>Place</div>
                    <div className={classes.line}></div>
                    <div className={classes.value}>
                      {reservation?.general.place}
                    </div>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Space</div>
                    <div className={classes.line}></div>
                    <div className={classes.value}>
                      {reservation?.general.space.join(", ")}
                    </div>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Table</div>
                    <div className={classes.line}></div>
                    <div className={classes.value}>
                      {reservation?.general.table.join(", ")}
                    </div>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Guests</div>
                    <div className={classes.line}></div>

                    <span className={classes.textWrapper}>
                      {reservation?.general.quests}{" "}
                    </span>
                    <span className={classes.span1}>
                      / {reservation?.general.tableSeats}
                    </span>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Date &amp; time</div>
                    <div className={classes.line}></div>
                    <div className={classes.value}>
                      {dayjs(reservation?.general.date).format(
                        "DD MMMM YYYY, HH:mm"
                      )}
                    </div>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Status</div>
                    <div className={classes.line}></div>
                    <div className={classes.badge}>
                      <div className={classes.dot} />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                      >
                        <circle cx="3" cy="3" r="3" fill="#36BAF2" />
                        <circle
                          cx="3"
                          cy="3"
                          r="3"
                          fill="url(#paint0_linear_4676_16183)"
                          fillOpacity="0.2"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_4676_16183"
                            x1="6.10716"
                            y1="3"
                            x2="8.54298e-07"
                            y2="3"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="white" />
                            <stop
                              offset="1"
                              stop-color="white"
                              stop-opacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className={classes.item1}>
                        {reservation?.general.status}
                      </div>
                    </div>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Waiter</div>
                    <div className={classes.line}></div>
                    <div className={classes.tag}>
                      <div className={classes.label4}>
                        <img
                          className={classes.ClientImage}
                          src={
                            isCustomAvatar
                              ? require(`../../assets/${avatarFileName}`)
                                  .default
                              : reservation?.general.waiterAvatar !== null
                              ? reservation?.general.waiterAvatar
                              : DEFAULT_IMAGE
                          }
                          alt={reservation?.general.waiterName}
                        />
                      </div>
                    </div>
                    <div className={classes.clientUsername}>
                      {reservation?.general.waiterName}
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.section}>
                <div className={classes.title}>
                  <div className={classes.labelWrapper}>
                    <div className={classes.div}>Preorder</div>
                  </div>
                </div>
                <div className={classes.list2}>
                  {reservation?.orders.map((order) => (
                    <div className={classes.row}>
                      <p className={classes.title2}>
                        <span className={classes.span}>{order.title}</span>
                        <span className={classes.span1}>
                          {" "}
                          x{order.quantity}
                        </span>
                      </p>
                      <div className={classes.line}></div>
                      <div className={classes.item2}>
                        <div className={classes.text}>{order.price}</div>
                        <div className={classes.span2}>MDL</div>
                      </div>
                    </div>
                  ))}
                  <div className={classes.contentwrapper}>
                    <div className={classes.content2}>
                      <div className={classes.title3}>Total</div>
                      <div className={classes.item4}>
                        <div className={classes.text2}>
                          {reservation?.ordersTotal}
                        </div>
                        <div className={classes.span2}>MDL</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.ContactSection}>
                <div className={classes.title}>
                  <div className={classes.labelWrapper}>
                    <div className={classes.div}>Contacts</div>
                  </div>
                </div>
                <div className={classes.list2}>
                  <div className={classes.row}>
                    <div className={classes.label2}>Full name</div>
                    <div className={classes.line}></div>
                    <div className={classes.NameContainer}>
                      <div className={classes.ImageContainer}>
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
                      </div>
                    </div>
                    <div className={classes.clientUsername}>
                      {reservation?.contacts.username}
                    </div>
                  </div>
                  <div className={classes.row}>
                    <div className={classes.label2}>Phone number</div>
                    <div className={classes.line}></div>
                    <div className={classes.value}>
                      {formatPhoneNumber(reservation?.contacts.phoneNumber)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.Actions}>
              <button className={classes.ExportButton}>
                <span className={classes.ExportButtonIcon}>{uploadIcon}</span>
                <span className={classes.ExportButtonText}>
                  Export order to PDF
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsClients;
