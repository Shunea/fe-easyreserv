import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import { createSupplier } from "../../auth/api/requests";
import {
  checkedCheckbox,
  closeIcon,
  emptyCheckBox,
  LeftArrow,
} from "../../icons/icons";
import classes from "./CreateSupplier.module.css";

type Props = {
  onCancel: () => void;
  onCloseSideBar: () => void;
  setSuppliers: any;
  suppliers: any[];
};

const CreateSupplier = (props: Props) => {
  const [companyName, setCompanyName] = useState("");
  const handleEditCompanyName = (e) => {
    setCompanyName(e.target.value);
  };

  const [telegramID, setTelegramID] = useState("");
  const handleEditTelegramID = (e) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9-_\.]/g, "");
    setTelegramID(sanitizedValue);
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(false);

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{10,14}$/;

    return phoneNumberPattern.test(phoneNumber);
  };
  const [companyEmail, setCompanyEmail] = useState("");
  const handleEditCompanyEmail = (e) => {
    setCompanyEmail(e.target.value);
  };
  const [companyBank, setCompanyBank] = useState("");
  const handleEditCompanyBank = (e) => {
    setCompanyBank(e.target.value);
  };
  const [companyIDNO, setCompanyIDNO] = useState<string>("");
  const handleEditCompanyIDNO = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 13);

    setCompanyIDNO(truncatedValue);
  };
  const [companyVAT, setCompanyVAT] = useState("");
  const handleEditCompanyVAT = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 7);
    setCompanyVAT(truncatedValue);
  };
  const [companyIBAN, setCompanyIBAN] = useState("");
  const handleEditCompanyIBAN = (e) => {
    const truncatedValue = e.target.value.slice(0, 24).toUpperCase();
    setCompanyIBAN(truncatedValue);
  };

  const handleCreateSupplier = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const supplierData = {
        name: companyName,
        phoneNumber: `+${phoneNumber}`,
        email: companyEmail,
        idno: companyIDNO,
        vatNumber: companyVAT,
        iban: companyIBAN,
        bankName: companyBank,
        telegramId: telegramID,
      };

      const createdSupplier = await createSupplier(supplierData);
      success();
      const updatedSuppliers = [...props.suppliers, createdSupplier];
      props.setSuppliers(updatedSuppliers);
      props.onCancel();
    } catch (error) {
      console.error("Can't add stock:", error);
    }
  };

  const success = () =>
    toast.success("Succes!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const [vatIsChecked, setVatIsChecked] = useState(false);
  const handleCheckVat = () => {
    setVatIsChecked((prevState) => !prevState);
  };

  const disabled =
    companyName === "" ||
    valid === false ||
    companyEmail === "" ||
    companyIDNO === "" ||
    companyIBAN === "" ||
    companyBank === "";

  const preferedCountries = ["md", "ro", "ae", "il", "it", "si"];

  return (
    <>
      <div className={classes.AddVacationHead}>
        <div className={classes.HeadHeading}>
          <button className={classes.BackButton} onClick={props.onCancel}>
            {LeftArrow}
          </button>
          <span className={classes.HeadingTitle}>Create supplier</span>
        </div>
        <div className={classes.HeadActions}>
          <button
            className={classes.CloseButton}
            onClick={props.onCloseSideBar}
          >
            {closeIcon}
          </button>
        </div>
      </div>
      <div className={classes.BoxForm}>
        <section className={classes.BoxFormSection}>
          <div className={classes.SectionContent}>
            <div className={classes.SectionRow}>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>Company name</label>
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={handleEditCompanyName}
                  className={classes.InputField}
                  placeholder="Enter company name"
                ></input>
              </div>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>Telegram ID</label>
                </div>
                <input
                  type="text"
                  value={telegramID}
                  onChange={handleEditTelegramID}
                  className={classes.InputField}
                  placeholder="Enter telegram id"
                ></input>
              </div>
            </div>
            <div className={classes.SectionRow}>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>Phone number</label>
                </div>
                <PhoneInput
                  country={"md"}
                  value={phoneNumber}
                  countryCodeEditable={false}
                  preferredCountries={preferedCountries}
                  onChange={handleChange}
                  placeholder="Enter phone number"
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
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>E-mail address</label>
                </div>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={handleEditCompanyEmail}
                  className={classes.InputField}
                  placeholder="Enter e-mail address"
                ></input>
              </div>
            </div>
          </div>
        </section>
        <div className={classes.Line}></div>
        <section className={classes.BoxFormSection}>
          <div className={classes.SectionContent}>
            <div className={classes.SectionRow}>
              {" "}
              <div
                className={classes.InputContainer}
                style={{ minWidth: "331.5px" }}
              >
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>IDNO</label>
                </div>
                <input
                  type="text"
                  value={companyIDNO}
                  maxLength={13}
                  onChange={handleEditCompanyIDNO}
                  className={classes.InputField}
                  placeholder="Enter IDNO"
                ></input>
              </div>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>
                    VAT identification number
                  </label>
                </div>
                <input
                  type="text"
                  value={companyVAT}
                  maxLength={7}
                  onChange={handleEditCompanyVAT}
                  className={classes.InputField}
                  placeholder="Enter VAT number"
                  disabled={!vatIsChecked}
                ></input>
              </div>
              <div
                className={classes.InputContainer}
                style={{ maxWidth: "30px" }}
              >
                {" "}
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>TVA</label>
                </div>
                <button className={classes.CheckBox} onClick={handleCheckVat}>
                  {vatIsChecked ? checkedCheckbox : emptyCheckBox}
                </button>
              </div>
            </div>
            <div className={classes.SectionRow}>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>IBAN code</label>
                </div>
                <input
                  type="text"
                  value={companyIBAN}
                  onChange={handleEditCompanyIBAN}
                  maxLength={24}
                  className={classes.InputField}
                  placeholder="Enter IBAN code"
                ></input>
              </div>
              <div className={classes.InputContainer}>
                <div className={classes.InputLabelContainer}>
                  <label className={classes.InputLabel}>Bank name</label>
                </div>
                <input
                  type="text"
                  value={companyBank}
                  onChange={handleEditCompanyBank}
                  className={classes.InputField}
                  placeholder="Enter bank name"
                ></input>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className={classes.Action}>
        <button
          className={classes.SaveButton}
          onClick={handleCreateSupplier}
          disabled={disabled}
        >
          <label className={classes.SaveText}>Save supplier</label>
        </button>
      </div>
    </>
  );
};
export default CreateSupplier;
