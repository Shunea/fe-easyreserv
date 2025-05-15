import { useEffect, useRef, useState } from "react";
import { closeIcon, plusSizeIcon, searchSupplierIcon } from "../../icons/icons";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import CustomSelect from "../Staff/EditEmployee/components/CustomSelect";
import classes from "./CreateOrder.module.css";
import CustomSelectStyles from "../Staff/EditEmployee/components/CustomSelectStyles";
import {
  createOrderByEmail,
  createOrderByTelegram,
  getSuppliers,
} from "../../auth/api/requests";
import CheckboxComponent from "../Staff/EditEmployee/VacationTab/CheckboxComponent";
import { toast } from "react-toastify";
import CreateSupplier from "./CreateSupplier";

type Props = {
  handleClose: () => void;
  stockName: string;
};

type Filter = {
  sortBy?: {
    column: string;
    order: string;
  };
  search?: string;
  pagination?: number;
};

type Supplier = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  image: string;
};
const CreateOrder = (props: Props) => {
  const InviteModalRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState(props.stockName);
  const handleEditTitle = (e) => {
    setTitle(e.target.value);
  };

  const [message, setMessage] = useState("");
  const handleEditMessage = (e) => {
    setMessage(e.target.value);
  };

  const [selectedVolume, setSelectedVolume] = useState("");
  const handleEditVolume = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9]/g, "");
    setSelectedVolume(sanitizedValue);
  };

  const customStyles = {
    ...CustomSelectStyles,
    control: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
      height: "52px",
      padding: "0px 16px",
      alignItems: "center",
      gap: "8px",
      alignSelf: "stretch",
      borderRadius: "12px",
      background: "var(--brand-snow, #FFF)",
      border: "1px solid #EEE",
      minWidth: "167px",

      "&:hover": {
        borderColor: "#FE9800 !important",
        boxShadow: "0 0 0 1px #FE9800",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#020202",
      opacity: "0.35",
    }),
  };

  const [searchValue, setSearchValue] = useState("");
  const handleEditSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter: Filter = {};
        if (searchValue !== "" && searchValue.length > 2) {
          filter.search = searchValue;
        }
        const suppliersResponse = await getSuppliers(filter);
        setSuppliers(suppliersResponse.data);
        if (selectedSupplier) {
          const isSupplierInResponse = suppliersResponse.data.some(
            (supplier) => supplier.id === selectedSupplier.id
          );

          if (
            !isSupplierInResponse &&
            searchValue !== "" &&
            searchValue.length > 2
          ) {
            setSelectedSupplier(null);
          }
        }
      } catch {}
    };
    fetchData();
  }, [searchValue, selectedSupplier]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const handleCheckboxChange = (supplier) => {
    if (selectedSupplier?.id === supplier.id) {
      setSelectedSupplier(null);
    } else {
      setSelectedSupplier(supplier);
    }
  };

  const [createSupplier, setCreateSupplier] = useState(false);
  const handleChangeCreateSupplier = () => {
    setCreateSupplier((prevState) => !prevState);
  };

  const [telegramSelected, setTelegramSelected] = useState(false);
  const handleChangeTelegramSelected = () => {
    setTelegramSelected((prevState) => !prevState);
  };

  const [emailSelected, setEmailSelected] = useState(false);
  const handleChangeEmailSelected = () => {
    setEmailSelected((prevState) => !prevState);
  };

  const [isHoveredTelegram, setIsHoveredTelegram] = useState(false);

  const handleHoverTelegram = (value) => {
    setIsHoveredTelegram(value);
  };
  const [isHoveredEmail, setIsHoveredEmail] = useState(false);

  const handleHoverEmail = (value) => {
    setIsHoveredEmail(value);
  };

  const succes = () =>
    toast.success("Sent!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const orderData = {
        productTitle: title,
        productVolume: selectedVolume,
        message: message,
        telegram: telegramSelected,
        email: emailSelected,
      };
      if (orderData.telegram === true) {
        await createOrderByTelegram(selectedSupplier?.id, orderData);
      } else {
        createOrderByEmail(selectedSupplier?.id, orderData);
      }

      props.handleClose();
      succes();
    } catch (error) {
      console.error("Can't create Supplier:", error);
    }
  };

  const disabled =
    title === "" ||
    selectedVolume === "" ||
    message === "" ||
    selectedSupplier === null ||
    !(telegramSelected || emailSelected);

  return (
    <>
      <div className={classes.EditEmployeeModal}>
        <OutsideClickHandler
          innerRef={InviteModalRef}
          onClose={props.handleClose}
        />

        <div className={classes.EditEmployeeBox} ref={InviteModalRef}>
          {createSupplier === true ? (
            <CreateSupplier
              onCancel={handleChangeCreateSupplier}
              onCloseSideBar={props.handleClose}
              setSuppliers={setSuppliers}
              suppliers={suppliers}
            />
          ) : (
            <>
              <div className={classes.Head}>
                <label className={classes.HeadText}>Create new order</label>
                <button
                  className={classes.headingInviteCloseBtn}
                  onClick={props.handleClose}
                >
                  {closeIcon}
                </button>
              </div>
              <div className={classes.Form}>
                <div className={classes.FormRow}>
                  <div className={classes.InputContainer}>
                    <div className={classes.InputLabelContainer}>
                      <label className={classes.InputLabel}>Title</label>
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={handleEditTitle}
                      className={classes.InputField}
                      placeholder="Enter stock title"
                      readOnly
                      style={{ fontWeight: 500 }}
                    ></input>
                  </div>
                  <div className={classes.InputContainer}>
                    <div className={classes.InputLabelContainer}>
                      <label className={classes.InputLabel}>Quantity</label>
                    </div>
                    <input
                      type="text"
                      value={selectedVolume}
                      onChange={handleEditVolume}
                      className={classes.InputField}
                      placeholder="What volume to order?"
                    ></input>
                  </div>
                </div>
                <div className={classes.FormRow}>
                  <div className={classes.InputContainer}>
                    <div className={classes.InputLabelContainer}>
                      <label className={classes.InputLabel}>Message</label>
                    </div>
                    <textarea
                      value={message}
                      onChange={handleEditMessage}
                      className={classes.MessageField}
                      placeholder="Enter additional comments"
                    ></textarea>
                  </div>
                </div>
                <div className={classes.Suppliers}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>Supplier</label>
                  </div>
                  <div className={classes.SupplierContent}>
                    <div
                      className={classes.InputContainer}
                      style={{ position: "relative", width: "100%" }}
                    >
                      <div className={classes.SearchIcon}>
                        {searchSupplierIcon}
                      </div>
                      <input
                        type="text"
                        value={searchValue}
                        onChange={handleEditSearchValue}
                        className={classes.InputField}
                        placeholder="Search for a supplier"
                      ></input>
                    </div>
                    <div className={classes.SupplierListContainer}>
                      <div
                        className={classes.SupplierList}
                        style={{ maxHeight: "272px", overflow: "auto" }}
                      >
                        {suppliers.length > 0 &&
                          suppliers.map((supplier) => (
                            <div
                              className={classes.SupplierRow}
                              key={supplier.id}
                            >
                              <CheckboxComponent
                                vacation={supplier}
                                onCheckboxChange={handleCheckboxChange}
                                isChecked={selectedSupplier?.id === supplier.id}
                              />
                              <div className={classes.SupplierNameContainer}>
                                <img
                                  src={
                                    supplier.image !== null
                                      ? supplier.image
                                      : "https://easyreserv.s3.eu-central-1.amazonaws.com/images/1ff722fe-ed86-4a52-9ab5-01890db36130.png"
                                  }
                                  alt={supplier.name}
                                  className={classes.SupplierImage}
                                />
                                <div className={classes.SupplierNameBox}>
                                  <label className={classes.SupplierName}>
                                    {supplier.name}
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <button
                        className={classes.AddSupplierButton}
                        onClick={handleChangeCreateSupplier}
                      >
                        <span
                          style={{
                            color: "#FE9800",
                            height: "20px",
                            width: "20px",
                          }}
                        >
                          {plusSizeIcon}
                        </span>
                        <span className={classes.AddSupplierText}>
                          Add new supplier
                        </span>
                      </button>
                    </div>
                    <div className={classes.FormRow}>
                      <button
                        className={classes.AddSupplierButton}
                        disabled
                        style={{
                          width: "100%",

                          backgroundColor: telegramSelected
                            ? "#FE9800"
                            : "#FAFAFA",
                          ...(isHoveredTelegram && {
                            backgroundColor: "#FE9800",
                          }),
                        }}
                        onClick={handleChangeTelegramSelected}
                        onMouseEnter={() => handleHoverTelegram(true)}
                        onMouseLeave={() => handleHoverTelegram(false)}
                      >
                        <span className={classes.AddSupplierText}>
                          Send on Telegram
                        </span>
                      </button>
                      <button
                        className={classes.AddSupplierButton}
                        style={{
                          width: "100%",
                          backgroundColor: emailSelected
                            ? "#FE9800"
                            : "#FAFAFA",
                          ...(isHoveredEmail && { backgroundColor: "#FE9800" }),
                        }}
                        onClick={handleChangeEmailSelected}
                        onMouseEnter={() => handleHoverEmail(true)}
                        onMouseLeave={() => handleHoverEmail(false)}
                      >
                        <span className={classes.AddSupplierText}>
                          Send on Email
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.FormAction}>
                <button
                  className={classes.CreateButton}
                  disabled={disabled}
                  onClick={handleSubmit}
                >
                  <span className={classes.CreateText}>Create order</span>
                </button>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default CreateOrder;
