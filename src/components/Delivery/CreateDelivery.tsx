import { useRef, useState } from "react";
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
  const [paymentType, setPaymentType] = useState("");
  const paymentOptions = [
    { value: "CASH", label: "Cash" },
    { value: "CARD", label: "Card" },
    { value: "TRANSFER", label: "Transfer" },
    { value: "MIA", label: "MIA" },
  ];
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
  const courierStatus = [
    { value: "WAITING", label: "Waiting" },
    { value: "PREPARING", label: "Preparing" },
    { value: "ORDER", label: "Order" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [preparationTimeEstimate, setPreparationTimeEstimate] = useState("");



  const [isDeliveryMenuOpen, setIsDeliveryMenuOpen] = useState(false); 

  const handleDeliveryMenu = () => {
    setIsDeliveryMenuOpen(true); 
  };

  const closeDeliveryMenu = () => {
    setIsDeliveryMenuOpen(false); 
  };

{/* for save button
  const disabled =
    ClientphoneNumber === "" ||
    CurierphoneNumber === "" ||
    clientName === "" ||
    comments === "" ||
    order === "" ||
    paymentType === "" ||
    totalAmount === "" ||
    street === "" ||
    block === "" ||
    floor === "" ||
    intercom === "" || 
    restaurantID === "" ||
    operator === "" ||
    courier === "" ||
    estimatedDeliveryTime === "" ||
    preparationTimeEstimate === "" 
 */}   

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
          <DeliveryMenu isOpen={isDeliveryMenuOpen} onClose={closeDeliveryMenu} />
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
                    onChange={(e) => setOrder(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter order details"
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
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter total amount"
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
                    onChange={(e) => setRestaurantID(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter restaurant ID"
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
                    options={courierStatus}
                    placeholder="Select status curier"
                    styles={CustomSelectStyles}
                  />
                </div>
              </div>
              <div className={classes.SectionRow}>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Timp estimativ de livrare</label>
                  <input
                    type="text"
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter estimated delivery time"
                  />
                </div>
                <div className={classes.InputContainer}>
                  <label className={classes.InputLabel}>Estimare timp pregatire</label>
                  <input
                    type="text"
                    value={preparationTimeEstimate}
                    onChange={(e) => setPreparationTimeEstimate(e.target.value)}
                    className={classes.InputField}
                    placeholder="Enter preparation time estimate"
                  />
                </div>
              </div>
            </div>
            <div className={classes.BoxAction}>
                <button
                  className={classes.SaveItemButton}
                  //onClick={handleClose}
                  //disabled={disabled}
                >
                  <span className={classes.SaveItemText}>Save delivery</span>
                </button>
              </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;

