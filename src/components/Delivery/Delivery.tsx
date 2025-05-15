import { useEffect, useState } from "react";
import classes from "./Delivery.module.css";
import { NotificationButton } from "../Statistics/Header";
import ToggleButton from "./ToggleButton";
import CreateDelivery from "./CreateDelivery";
import api from "../../auth/api/apiInstance";
import { DeliveryOrderData } from "../../auth/api/requests";

const Delivery = () => {
  const [isToggleActive, setIsToggleActive] = useState(() => {
    const savedState = localStorage.getItem("toggleState");
    return savedState === "true";
  });
  const [isCreateDeliveryOpen, setIsCreateDeliveryOpen] = useState(false);
  const [deliveries, setDeliveries] = useState<DeliveryOrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/delivery/orders");
      setDeliveries(Array.isArray(response.data.data) ? response.data.data : []);
      
      console.log('Response:', response.data);
      console.log('Deliveries:', response.data.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError("Failed to load deliveries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleToggle = () => {
    setIsToggleActive(prev => !prev);
  };

  const handleCreateDelivery = () => {
    setIsCreateDeliveryOpen(true);
  };

  const closeCreateDelivery = () => {
    setIsCreateDeliveryOpen(false);
    fetchDeliveries(); // Обновляем список после создания
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
      
      {isLoading ? (
        <div className={classes.LoadingMessage}>Loading deliveries...</div>
      ) : error ? (
        <div className={classes.ErrorMessage}>{error}</div>
      ) : Array.isArray(deliveries) && deliveries.length > 0 ? (
        <div className={classes.TableBody}>
          {deliveries.map((delivery, index) => (
            <div key={index} className={classes.TableRow}>
              <div className={classes.TableCell}>{delivery.restaurant_id}</div>
              <div className={classes.TableCell}>{delivery.operator_status}</div>
              <div className={classes.TableCell}>{delivery.operator_modified_at}</div>
              <div className={classes.TableCell}>{delivery.client_name}</div>
              <div className={classes.TableCell}>{delivery.client_phone}</div>
              <div className={classes.TableCell}>{delivery.comments}</div>
              <div className={classes.TableCell}>Order details</div>
              <div className={classes.TableCell}>{delivery.order_date}</div>
              <div className={classes.TableCell}>{`${delivery.address_staircase} ${delivery.address_entrance}`}</div>
              <div className={classes.TableCell}>{delivery.payment_type}</div>
              <div className={classes.TableCell}>{delivery.total_amount} MDL</div>
              <div className={classes.TableCell}>{delivery.courier_id}</div>
              <div className={classes.TableCell}>{delivery.courier_phone}</div>
              <div className={classes.TableCell}>{delivery.courier_status}</div>
              <div className={classes.TableCell}>{delivery.estimated_delivery_time} minutes</div>
              <div className={classes.TableCell}>{delivery.estimated_preparation_time} minutes</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.LoadingMessage}>No deliveries found</div>
      )}

      {isCreateDeliveryOpen && (
        <CreateDelivery handleClose={closeCreateDelivery} />
      )}
    </div>
  );
};

export default Delivery;