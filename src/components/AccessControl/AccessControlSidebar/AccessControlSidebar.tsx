import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "src/auth/api/requests";
import classes from "./AccessControlSidebar.module.css";

const AccessControlSidebar = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  useEffect(() => {
    const storedRestaurant = localStorage.getItem("selectedRestaurant");
    if (storedRestaurant) {
      setSelectedRestaurant(JSON.parse(storedRestaurant));
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarContent}>
        <div className={classes.restaurantInfo}>
          {selectedRestaurant && (
            <>
              <div className={classes.restaurantAvatar}>
                <img
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                />
              </div>
            </>
          )}
        </div>
        <button className={classes.logoutButton} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOut} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default AccessControlSidebar;