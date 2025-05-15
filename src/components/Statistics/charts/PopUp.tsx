import React from "react";
import classes from "../styles/statistics.module.css";
interface Props {
  // date:any,
  data: any;
  props: React.SVGProps<SVGRectElement> | null
}
function PopUp({ data,props }: Props) {
  function formatDate(dateString) {
    // Parsați data pentru a obține obiectul Date
    const date = new Date(dateString);

    // Definește numele zilei în șir
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];

    // Definește numele lunii în șir
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = months[date.getMonth()];

    // Obține ziua din lună și anul
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    // Construiește șirul de caractere final
    const formattedDate = `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${year}`;

    return formattedDate;
  }

  // Exemplu de utilizare:
  
  return (
    <div className={classes.Popup} style={{top: Number(props?.y)-20, left: Number(props!.x) + Number(props!.width)+20}}>
      <span style={{ fontSize: 12, opacity: 0.8, color: "white" }}>
        {formatDate(data.date)}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            background: "rgba(35, 177, 33, 1)",
            width: 10,
            height: 10,
            borderRadius: "50%",
          }}
        ></div>
        <span style={{ fontSize: 24, fontWeight: 700, color: "white" }}>
          {data.count ? data.count : 0}%
        </span>
        <span style={{ fontSize: 10, opacity: 0.6, color: "white", width: 0 }}>
          average occupancy
        </span>
      </div>
    </div>
  );
}

export default PopUp;
