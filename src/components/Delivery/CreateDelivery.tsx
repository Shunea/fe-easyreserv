import { useRef, useState, useEffect } from "react";
import classes from "./CreateDelivery.module.css";
import { LeftArrow } from "../../icons/icons";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import { ThemeProvider } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import theme from "../Staff/EditEmployee/ScheduleTab/theme";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import 'dayjs/locale/en-gb';
import CustomSelect from "../Staff/EditEmployee/components/CustomSelect";
import CustomSelectStyles from "../Staff/EditEmployee/components/CustomSelectStyles";
import PhoneInput from "react-phone-input-2";
import DeliveryMenu from "./DeliveryMenu";
import { createDeliveryOrder } from "../../auth/api/requests";
import { DeliveryOrderData, PaymentType, CourierStatus, OperatorStatus } from "../../auth/api/requests";

const deliveryTimeOptions = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "150", label: "2.5 hours" },
  { value: "180", label: "3 hours" },
];

const preparationTimeOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

const paymentOptions: { value: PaymentType; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "POS", label: "POS" },
  { value: "TRANSFER", label: "Transfer" },
];

const courierStatusOptions: { value: CourierStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PREPARATION", label: "In Preparation" },
  { value: "PICKED_UP", label: "Picked Up" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const operatorStatusOptions: { value: OperatorStatus; label: string }[] = [
  { value: "CONFIRM", label: "Confirm" },
  { value: "REJECT", label: "Reject" },
  { value: "MODIFY", label: "Modify" },
  { value: "PENDING", label: "Pending" },
];

const CreateDelivery = ({ handleClose }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);


  const [ClientphoneNumber, setClientPhoneNumber] = useState("");
  const [CurierphoneNumber, setCurierPhoneNumber] = useState("");
  const [valid, setValid] = useState(false);

  const handleClientChange = (value) => {
    setClientPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const handleCurierChange = (value) => {
    setCurierPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{10,14}$/;

    return phoneNumberPattern.test(phoneNumber);
  };

  const preferedCountries = ["md", "ro", "ae", "il", "it", "si"];

  // State variables for the new fields
  const [clientName, setClientName] = useState("");
  //const [clientPhone, setClientPhone] = useState("");
  const [comments, setComments] = useState("");
  const [order, setOrder] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("CASH");
  const [orderDateTime, setOrderDateTime] = useState<dayjs.Dayjs | null>(null);
  const [totalAmount, setTotalAmount] = useState("");

  const [street, setStreet] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [intercom, setIntercom] = useState("");

  const [restaurantID, setRestaurantID] = useState("");
  const [operator, setOperator] = useState("");
  const [modificationDateTime, setModificationDateTime] = useState<dayjs.Dayjs | null>(null);
  const [courier, setCourier] = useState("");
  //const [courierPhone, setCourierPhone] = useState("");
  const [StatusType, setStatusType] = useState("");
  const [courierStatus, setCourierStatus] = useState<CourierStatus>("PENDING");
  const [operatorStatus, setOperatorStatus] = useState<OperatorStatus>("PENDING");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [preparationTimeEstimate, setPreparationTimeEstimate] = useState("");



  const [isDeliveryMenuOpen, setIsDeliveryMenuOpen] = useState(false); 

  const handleDeliveryMenu = () => {
    setIsDeliveryMenuOpen(true); 
  };

  const closeDeliveryMenu = () => {
    setIsDeliveryMenuOpen(false); 
  };

  const handleOrderConfirm = (orderDetails: { items: string, totalAmount: number }) => {
    setOrder(orderDetails.items);
    setTotalAmount(orderDetails.totalAmount.toString());
  };

  useEffect(() => {
    try {
      const storedRestaurant = localStorage.getItem("selectedRestaurant");
      console.log("Stored restaurant data:", storedRestaurant);
      
      if (storedRestaurant) {
        const restaurantData = JSON.parse(storedRestaurant);
        console.log("Parsed restaurant data:", restaurantData);
        
        if (restaurantData && restaurantData.id) {
          setRestaurantID(restaurantData.id);
        }
      }
    } catch (error) {
      console.error("Error loading restaurant ID:", error);
    }
  }, []);

  const isFormValid = () => {
    return (
      ClientphoneNumber !== "" &&
      clientName !== "" &&
      order !== "" &&
      paymentType &&
      totalAmount !== "" &&
      street !== "" &&
      block !== "" &&
      floor !== "" &&
      intercom !== "" &&
      restaurantID !== "" &&
      operator !== "" &&
      courier !== "" &&
      CurierphoneNumber !== "" &&
      StatusType !== "" &&
      estimatedDeliveryTime !== "" &&
      preparationTimeEstimate !== ""
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Проверка обязательных полей
      if (!isFormValid()) {
        throw new Error("Please fill in all required fields");
      }

      // Проверка payment_type
      if (!['CASH', 'POS', 'TRANSFER'].includes(paymentType)) {
        throw new Error("Invalid payment type");
      }

      // Проверка courier_status
      if (!['PENDING', 'IN_PREPARATION', 'PICKED_UP', 'DELIVERED', 'CANCELLED'].includes(StatusType)) {
        throw new Error("Invalid courier status");
      }

      const deliveryData: DeliveryOrderData = {
        restaurant_id: restaurantID,
        client_name: clientName,
        client_phone: ClientphoneNumber,
        comments: comments,
        address_entrance: block,
        address_staircase: street,
        address_floor: floor,
        address_intercom: intercom,
        payment_type: paymentType,
        total_amount: parseFloat(totalAmount),
        courier_id: courier,
        courier_phone: CurierphoneNumber,
        courier_status: StatusType as CourierStatus,
        courier_pickup_time: modificationDateTime?.toISOString(),
        estimated_delivery_time: parseInt(estimatedDeliveryTime),
        estimated_preparation_time: parseInt(preparationTimeEstimate),
        operator_status: "CONFIRM" as OperatorStatus,
        operator_modified_at: modificationDateTime?.toISOString(),
        order_date: orderDateTime?.toISOString() || new Date().toISOString(),
        created_at: new Date().toISOString(),
        deleted_at: null,
        client_latitude: 0,
        client_longitude: 0,
        courier_latitude: 0,
        courier_longitude: 0
      };

      console.log('Sending delivery data:', deliveryData); // Для отладки

      const response = await createDeliveryOrder(deliveryData);
      console.log("Delivery created successfully:", response);
      
      handleClose();
    } catch (error) {
      console.error("Error creating delivery:", error);
      setError(error instanceof Error ? error.message : "Failed to create delivery");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.Modal}>
      <div className={classes.Box} ref={boxRef}>
        <OutsideClickHandler onClose={handleClose} innerRef={boxRef} />
        <div className={classes.AddVacationHead}>
          <div className={classes.HeadHeading}>
            <button className={classes.BackButton} onClick={handleClose}>
              {LeftArrow}
            </button>
            <span className={classes.HeadingTitle}>Create Delivery</span>
            <button className={classes.AddItemButton} onClick={handleDeliveryMenu}>
            <span className={classes.AddItemText}>Add new menu</span>
          </button>
          </div>
          <DeliveryMenu 
            isOpen={isDeliveryMenuOpen} 
            onClose={closeDeliveryMenu}
            onOrderConfirm={handleOrderConfirm} 
          />
        </div>
        <div className={classes.BoxForm}>
          {/* Client Section */}
          <section className={classes.BoxFormSection}>
            <div className={classes.SectionTitle}>
              <label className={classes.SectionTitleText}>Client</label>
            </div>
            <div className={classes.SectionContent}>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Nume client</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter client name"
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Numarul telefon client</label>
                <PhoneInput
                  country={"md"}
                  value={ ClientphoneNumber}
                  countryCodeEditable={false}
                  preferredCountries={preferedCountries}
                  onChange={handleClientChange}
                  placeholder="Enter Client phone number"
                  containerClass={classes.PhoneContainer}
                  inputClass={classes.PhoneInput}
                  dropdownClass={classes.PhoneDropDown}
                  buttonClass={classes.PhoneButton}
                  inputProps={{
                    required: true,
                  }}
                  />
                  </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Comentarii</label>
                  <input
                    type="text"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter comments"
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Comanda</label>
                  <input
                    type="text"
                    value={order}
                    className={`${classes.InputField} ${classes.ReadOnlyInput}`}
                    placeholder="Enter order details"
                    readOnly
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Data plasare comanda</label>
                  <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <DesktopDatePicker
                        label="Select date"
                        value={orderDateTime}
                        onChange={(newValue) => setOrderDateTime(newValue)}
                      />
                    </LocalizationProvider>
                  </ThemeProvider>
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Tip achitare</label>
                  <CustomSelect
                    onChange={(selectedOption) => setPaymentType(selectedOption.value)}
                    value={paymentType}
                    options={paymentOptions}
                    placeholder="Select payment type"
                    styles={CustomSelectStyles}
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
              <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Ora plasare comanda</label>
                  <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <TimePicker
                        label="Select time"
                        value={orderDateTime}
                        onChange={(newValue) => setOrderDateTime(newValue)}
                     />
                    </LocalizationProvider>
                  </ThemeProvider>
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Total suma</label>
                  <input
                    type="text"
                    value={totalAmount}
                    className={`${classes.InputField} ${classes.ReadOnlyInput}`}
                    placeholder="Enter total amount"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Adresa Comanda Section */}
          <section className={classes.BoxFormSection}>
            <div className={classes.SectionTitle}>
              <label className={classes.SectionTitleText}>Adresa comanda</label>
            </div>
            <div className={classes.SectionContent}>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Strada</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter street"
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Scara</label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter block"
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Etaj</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter floor"
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Interfon</label>
                  <input
                    type="text"
                    value={intercom}
                    onChange={(e) => setIntercom(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter intercom"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Restaurant Section */}
          <section className={classes.BoxFormSection}>
            <div className={classes.SectionTitle}>
              <label className={classes.SectionTitleText}>Restaurant</label>
            </div>
            <div className={classes.SectionContent}>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Restaurant ID</label>
                  <input
                    type="text"
                    value={restaurantID}
                    className={`${classes.InputField} ${classes.ReadOnlyInput}`}
                    placeholder="Restaurant ID"
                    readOnly
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Operator</label>
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter operator name"
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Data modificare operator</label>
                  <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <DesktopDatePicker
                        label="Select date"
                        value={modificationDateTime}
                        onChange={(newValue) => setModificationDateTime(newValue)}
                    />
                    </LocalizationProvider>
                  </ThemeProvider>
                </div>
              <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Ora modificare operator</label>
                  <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <TimePicker
                        label="Select Time"
                        value={modificationDateTime}
                        onChange={(newValue) => setModificationDateTime(newValue)}
                    />
                    </LocalizationProvider>
                  </ThemeProvider>
              </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Curier</label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter courier name"
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Numarul telefon curier</label>
                  <PhoneInput
                  country={"md"}
                  value={ CurierphoneNumber}
                  countryCodeEditable={false}
                  preferredCountries={preferedCountries}
                  onChange={handleCurierChange}
                  placeholder="Enter curier phone number"
                  containerClass={classes.PhoneContainer}
                  inputClass={classes.PhoneInput}
                  dropdownClass={classes.PhoneDropDown}
                  buttonClass={classes.PhoneButton}
                  inputProps={{
                    required: true,
                  }}
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Status curier</label>
                  <CustomSelect
                    onChange={(selectedOption) => setStatusType(selectedOption.value)}
                    value={StatusType}
                    options={courierStatusOptions}
                    placeholder="Select status curier"
                    styles={CustomSelectStyles}
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Timp estimativ de livrare</label>
                  <CustomSelect
                    onChange={(selectedOption) => setEstimatedDeliveryTime(selectedOption.value)}
                    value={estimatedDeliveryTime}
                    options={deliveryTimeOptions}
                    placeholder="Select delivery time"
                    styles={CustomSelectStyles}
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Estimare timp pregatire</label>
                  <CustomSelect
                    onChange={(selectedOption) => setPreparationTimeEstimate(selectedOption.value)}
                    value={preparationTimeEstimate}
                    options={preparationTimeOptions}
                    placeholder="Select preparation time"
                    styles={CustomSelectStyles}
                  />
                </div>
              </div>
            </div>
            <div className={classes.BoxAction}>
              <button
                className={classes.SaveItemButton}
                disabled={!isFormValid() || isLoading}
                onClick={handleSubmit}
              >
                <span className={classes.SaveItemText}>
                  {isLoading ? "Saving..." : "Save delivery"}
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
      
      {error && (
        <div className={classes.ErrorMessage}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateDelivery;

