import React, { useEffect, useRef, useState } from "react";
import clients from "./styles/clients.module.css";
import {
  NotificationsIcon,
  arrowLeftIcon,
  arrowRightIcon,
  checkIcon,
  dotIcon,
  exportIcon,
  leftArrowIcon,
  stockIcon,
} from "src/icons/icons";
import { useNavigate } from "react-router-dom";
import GetSpaces from "./components/GetSpaces";
import Range from "./components/Range";
import classes from "../Stock/Stock.module.css";
import { getAllNotifications } from "src/auth/api/requests";
import statistics from "./styles/statistics.module.css";
interface Props {
  title: string;
  setDate: React.Dispatch<any>;
  date: any;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  setSelectedPeriodType: React.Dispatch<React.SetStateAction<"year" | "month" | "week" | "day">>
}

function header(){
  return 
}

const Header = ({ title, setDate, date, index, setIndex,setSelectedPeriodType }: Props) => {
  const navigate = useNavigate();
  const interval: Array<"day" | "week" | "month" | "year"> = ["year", "month", "week", "day"];
  useEffect(()=>{
    setSelectedPeriodType(interval[index])
  },[index])
  const IntervalSelector = () => {
    return (
      <div style={{ width: 180, height: 52 }} className={clients.date_picker}>
        <div
          onClick={() => index > 0 && setIndex((prev) => prev - 1)}
          className={clients.DatePickerArrow}
        >
          {arrowLeftIcon}
        </div>

        <div className={clients.date_value}>By {interval[index]}s</div>
        <div
          onClick={() =>
            index < interval.length - 1 && setIndex((prev) => prev + 1)
          }
          className={clients.DatePickerArrow}
        >
          {arrowRightIcon}
        </div>
      </div>
    );
  };
  return (
    <div style={{ marginBottom: "40px" }} className={classes.HeadContainer}>
      <div className={classes.Head}>
        <div className={classes.Heading}>
          <div className={classes.Title}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 40,
                gap: 20,
              }}
            >
              <div
                onClick={() => navigate("/statistics")}
                style={{
                  border: "1px rgba(238, 238, 238, 1) solid",
                  position: "relative",
                  height: 40,
                  width: 40,
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 11,
                    color: "rgba(2, 2, 2, 1)",
                  }}
                >
                  {leftArrowIcon}
                </span>
              </div>
              <span style={{ fontWeight: 600, fontSize: 32 }}>{title}</span>
            </div>
          </div>
        </div>

        <div className={clients.Buttons}>
          <IntervalSelector />
          <Range date={date} setDate={setDate} customHeight={52} />
          <GetSpaces />
          <div className={clients.Export}>
            {exportIcon}
            <span>Export</span>
          </div>

          <NotificationButton />
        </div>
      </div>
    </div>
  );
};

export default Header;

export function NotificationButton() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    async function getNotifications() {
      try{
        const response = await getAllNotifications();
        setNotifications(response.data);
      }catch(e){
        console.log(e);
        
      }
    
      // console.log(response.data);
    }
    getNotifications();
  }, []);
  const notificationBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        notificationBoxRef.current &&
        !notificationBoxRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }}
      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
  },[])

  const currentDate = new Date();

  function calcTimeAgo(notification) {
    const createdDate: Date = new Date(notification.createdAt);
    const timeDifference: number =
      currentDate.getTime() - createdDate.getTime();

    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    return secondsAgo < 60
      ? `${secondsAgo} seconds`
      : minutesAgo < 60
      ? `${minutesAgo} minutes`
      : hoursAgo < 24
      ? `${hoursAgo} hours`
      : `${daysAgo} days`;
  }

  return (
    <div ref={notificationBoxRef} className={statistics.NotificationButton}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={statistics.NotificationButton}
      >
        <span className={statistics.NotificationIcon}>{NotificationsIcon}</span>
        <span className={statistics.NotificationDot}>{dotIcon}</span>
      </button>

      {showNotifications && (
        <div
          onMouseLeave={() => setShowNotifications(!false)}
          className={clients.NotificationsModal}
        >
          <div className={clients.NotificationsHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 20, fontWeight: 600 }}>
                Notifications
              </span>
              <div
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: "50%",
                  background: "rgba(242, 54, 54, 0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgba(242, 54, 54, 1)",
                  fontWeight: 800,
                }}
              >
                <span style={{ fontSize: 12 }}>{notifications.length}</span>
              </div>
            </div>
            <div
              style={{
                height: 30,
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 100,
                outline: "rgba(238, 238, 238, 1) 1px solid",
                display: "flex",
                alignItems: "center",
                gap: 6,
                justifyContent: "center",
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              <span style={{ opacity: "60%" }}>{checkIcon}</span> Mark all as
              read
            </div>
          </div>

          <div className={clients.NotificationsBody}>
            {notifications.map((n) => (
              <div className={clients.Notification}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(238, 238, 238, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    opacity: "60%",
                  }}
                >
                  {stockIcon}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: 14, lineHeight: "16.8px" }}>
                    <span style={{ fontWeight: 600 }}>{n.title}</span>{" "}
                    <span>{n.body}</span>
                  </div>
                  <span
                    style={{
                      opacity: "60%",
                      color: "rgba(2, 2, 2, 1)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {calcTimeAgo(n)} ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
