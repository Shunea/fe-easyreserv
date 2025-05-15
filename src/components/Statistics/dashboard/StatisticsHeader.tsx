import React, { useEffect, useState } from "react";
import classes from "../styles/statistics.module.css";
import { Restaurant } from "src/Types";
import { NotificationButton } from "../Header";
const StatisticsHeader = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRestaurant = JSON.parse(
          localStorage.getItem("selectedRestaurant") ?? "null"
        );

        if (storedRestaurant) {
          // Fetch the restaurant details based on the ID from your data source
          setSelectedRestaurant(storedRestaurant);
        }
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={classes.Head}>
      <div className={classes.Heading}>
        <div className={classes.CompanyTitle}>
          <label className={classes.CompanyName}>
            {selectedRestaurant?.name}
          </label>
          <span className={classes.CompanyStatus}></span>
        </div>
        <div className={classes.CompanyAddress}>
          <label className={classes.CompanyAddressText}>
            {selectedRestaurant?.address}
          </label>
        </div>
      </div>

      <NotificationButton />
    </div>
  );
};
export default StatisticsHeader;
