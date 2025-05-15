import classes from "./Delivery.module.css";
import { NotificationButton } from "../Statistics/Header";
import ToggleButton from "./ToggleButton";
import { useEffect, useState } from "react";
import CreateDelivery from "./CreateDelivery"; 

const Delivery = () => {
  const [isToggleActive, setIsToggleActive] = useState(() => {
    const savedState = localStorage.getItem("toggleState");
    return savedState === "true"; // Convert string to boolean
  });
  const [isCreateDeliveryOpen, setIsCreateDeliveryOpen] = useState(false); 

  const handleToggle = () => {
    setIsToggleActive(prev => !prev);
  };

  const handleCreateDelivery = () => {
    setIsCreateDeliveryOpen(true); 
  };

  const closeCreateDelivery = () => {
    setIsCreateDeliveryOpen(false); 
  };

  const headerFields = [
    "Restaurant ID",
    "Operator",
    "Data si Ora Modificare Operator",
    "Nume Client",
    "Numar Telefon Client",
    "Comentarii",
    "Comanda",
    "Data si Ora Plasare Comanda",
    "Adresa Comanda",
    "Tip achitare",
    "Total Suma",
    "Curier",
    "Numar telefon curier",
    "Status curier",
    "Timp estimativ de livrare",
    "Estimare timp pregatire",
  ];

  return (
    <div className={classes.HeadContainer}>
      <div className={classes.FixedHead}>
        <div className={classes.Heading}>
          <div className={classes.Title}>
            <h1 className={classes.TitleText}>Delivery list</h1>
          </div>
        </div>
        <div className={classes.HeadActions}>
          <ToggleButton onToggle={handleToggle} />
          <button className={classes.AddItemButton} disabled={!isToggleActive} onClick={handleCreateDelivery}>
            <span className={classes.AddItemText}>Add new delivery</span>
          </button>
          <NotificationButton />
        </div>
      </div>
      <div className={classes.TableHead} style={{marginTop: '75px', marginRight: '-45%'}}>
        {headerFields.map((field, index) => (
          <div key={index} className={classes.HeaderItem}>
            {field}
          </div>
        ))}
      </div>
      {isCreateDeliveryOpen && ( // Условный рендеринг окна CreateDelivery
        <CreateDelivery handleClose={closeCreateDelivery} />
      )}
    </div>
  );
};

export default Delivery;