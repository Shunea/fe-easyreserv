import { ElementType, useEffect, useRef, useState } from "react";
import {
  closeIcon,
  LeftArrow,
  plusSizeIcon,
  searchSupplierIcon,
} from "../../icons/icons";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import classes from "./CreateItem.module.css";
import CustomSelect from "../Staff/EditEmployee/components/CustomSelect";
import CustomSelectStyles from "../Staff/EditEmployee/components/CustomSelectStyles";
import { ThemeProvider } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import theme from "../Staff/EditEmployee/ScheduleTab/theme";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckboxComponent from "../Staff/EditEmployee/VacationTab/CheckboxComponent";
import {
  createStock,
  getDocuments,
  getSuppliers,
} from "../../auth/api/requests";
import { toast } from "react-toastify";
import CreateSupplier from "./CreateSupplier";
import Documents from "./Documents";

type Props = {
  handleClose: () => void;
  categories: any[];
  stockArray: any[];
  setStockArray: any;
};

const CreateItem = ({
  handleClose,
  categories,
  stockArray,
  setStockArray,
}: Props) => {
  const BoxRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const backendOptions = categories.map((category) => ({
    value: category,
    label:
      category.charAt(0).toUpperCase() +
      category.replace(/_/g, " ").slice(1).toLowerCase(),
  }));

  const [title, setTitle] = useState("");
  const handleEditTitle = (e) => {
    setTitle(e.target.value);
  };

  const [factureNr, setFactureNr] = useState("");
  const handleEditFactureNr = (e) => {
    setFactureNr(e.target.value);
  };

  const [searchValue, setSearchValue] = useState("");
  const handleEditSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const [volume, setVolume] = useState("");
  const handleEditVolume = (e) => {
    const input = e.target.value;
    // Check if the input consists only of digits
    if (/^\d*$/.test(input)) {
      setVolume(input);
    }
  };

  const [pcsVolume, setPcsVolume] = useState("");
  const handleEditPcsVolume = (e) => {
    const input = e.target.value;
    // Check if the input consists only of digits
    if (/^\d*$/.test(input)) {
      setPcsVolume(input);
    }
  };

  const [reoderLimit, setReorderLimit] = useState("");
  const handleEditReorderLimit = (e) => {
    const input = e.target.value;
    // Check if the input consists only of digits
    if (/^\d*$/.test(input)) {
      setReorderLimit(input);
    }
  };

  const [priceWoutTVA, setPriceWoutTVA] = useState<number>();
  const handleEditPriceWoutTVA = (e) => {
    const input = e.target.value;
    // Check if the input consists only of digits
    if (/^\d*\.?\d*$/.test(input)) {
      setPriceWoutTVA(input);
    }
  };

  // State to manage the selected option
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleSelectedCategoryChange = (selectedOption: any) => {
    setSelectedCategory(selectedOption.value);
  };

  const [selectedUnit, setSelectedUnit] = useState("");
  const handleSelectedUnitChange = (selectedOption: any) => {
    setSelectedUnit(selectedOption.value);
  };

  const [selectedPcsUnit, setSelectedPcsUnit] = useState("");
  const handleSelectedPcsUnitChange = (selectedOption: any) => {
    setSelectedPcsUnit(selectedOption.value);
  };

  const [totalPrice, setTotalPrice] = useState<number>();

  const [selectedTVA, setSelectedTVA] = useState(0);
  const handleSelectedTVAChange = (selectedOption: any) => {
    setSelectedTVA(selectedOption.value);
  };

  const [selectedMoney, setSelectedMoney] = useState("");
  const handleSelectedMoneyChange = (selectedOption: any) => {
    setSelectedMoney(selectedOption.value);
  };

  useEffect(() => {
    if (priceWoutTVA !== undefined && selectedTVA !== undefined) {
      const tva = (priceWoutTVA * selectedTVA) / 100;
      const calculatedTotalPrice = Number(priceWoutTVA) - tva;
      setTotalPrice(calculatedTotalPrice);
    }
  }, [priceWoutTVA, selectedTVA]);

  const tvaTypes = [
    {
      value: 8,
      label: "8%",
    },
    {
      value: 12,
      label: "12%",
    },
    {
      value: 20,
      label: "20%",
    },
  ];

  const units = [
    {
      value: "gr",
      label: "grams",
    },
    {
      value: "pcs",
      label: "pcs",
    },
    {
      value: "ml",
      label: "ml",
    },
    {
      value: "l",
      label: "litres",
    },
    {
      value: "kg",
      label: "kg",
    },
  ];

  const Pcsunits = [
    {
      value: "gr",
      label: "grams",
    },
    {
      value: "ml",
      label: "ml",
    },

    {
      value: "l",
      label: "litres",
    },
    {
      value: "kg",
      label: "kg",
    },
  ];

  const money = [
    {
      value: "TRANSFER",
      label: "Transfer",
    },
    {
      value: "CASH",
      label: "Cash",
    },
  ];

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

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const handleCheckboxChange = (supplier) => {
    if (selectedSupplier?.id === supplier.id) {
      setSelectedSupplier(null);
    } else {
      setSelectedSupplier(supplier);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentResponse = await getDocuments();
        setDocsLength(documentResponse.data.length);
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

  const icon: ElementType<any> = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2.40002 8.03332H21.6M2.40002 8.03332V6.49999C2.40002 4.84313 3.74317 3.49999 5.40002 3.49999H7.20002M2.40002 8.03332V19.2C2.40002 20.8568 3.74317 22.2 5.40002 22.2H18.6C20.2569 22.2 21.6 20.8568 21.6 19.2V8.03332M21.6 8.03332V6.49999C21.6 4.84313 20.2569 3.49999 18.6 3.49999H16.8M8.04708 14.6444L11.2094 17.6667L15.953 13.1333M7.20002 3.49999H16.8M7.20002 3.49999V1.79999M7.20002 3.49999V4.63332M16.8 3.49999V1.79999M16.8 3.49999V4.63332"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const [date, setDate] = useState(null);
  const minYear = 1900;
  const maxYear = 2099;

  const maxDate = dayjs(`${maxYear}-12-31`);

  const handleCardExpireOnChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setDate(newDate);
    } else if (newYear < minYear) {
      setDate(newDate.set("year", minYear));
    } else {
      setDate(newDate.set("year", maxYear));
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

  const handleCreateStock = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const stockData = {
        title: title,
        category: selectedCategory,
        expirationDate: dayjs(date).format("YYYY-MM-DD"),
        volume: Number(volume),
        unit: selectedUnit,
        reorderLimit: Number(reoderLimit),
        tvaType: selectedTVA,
        priceWithoutTva: totalPrice || 0,
        pcVolume: Number(pcsVolume),
        pcUnit: selectedPcsUnit,
        invoiceNumber: factureNr,
        paymentMethod: selectedMoney,
      };
      console.log(stockData);
      if (selectedSupplier !== null && (priceWoutTVA !== 0 || undefined)) {
        const createdStock = await createStock(selectedSupplier.id, stockData);
        const updatedStockArray = [...stockArray, createdStock];
        handleClose();
        success();
        setStockArray(updatedStockArray);
        // updatedStockArray.push(createdStock);
      }
    } catch (error) {
      console.error("Can't add stock:", error);
    }
  };

  const disabled =
    title === "" ||
    selectedCategory === "" ||
    date === null ||
    volume === "" ||
    selectedUnit === "" ||
    reoderLimit === "" ||
    selectedTVA === 0 ||
    priceWoutTVA === undefined ||
    selectedSupplier === null ||
    factureNr === "" ||
    selectedMoney === "";

  const [createSupplier, setCreateSupplier] = useState(false);
  const handleChangeCreateSupplier = () => {
    setCreateSupplier((prevState) => !prevState);
  };

  const [docsLength, setDocsLength] = useState(0);

  return (
    <div className={classes.Modal}>
      <div className={classes.Box} ref={BoxRef}>
        <OutsideClickHandler innerRef={BoxRef} onClose={handleClose} />
        {createSupplier === true ? (
          <CreateSupplier
            onCancel={handleChangeCreateSupplier}
            onCloseSideBar={handleClose}
            setSuppliers={setSuppliers}
            suppliers={suppliers}
          />
        ) : (
          <>
            <div className={classes.AddVacationHead}>
              <div className={classes.HeadHeading}>
                <button className={classes.BackButton}>{LeftArrow}</button>
                <span className={classes.HeadingTitle}>Create item</span>
              </div>
              <div className={classes.HeadActions}>
                <button className={classes.CloseButton} onClick={handleClose}>
                  {closeIcon}
                </button>
              </div>
            </div>
            <div className={classes.BoxForm}>
              <section className={classes.BoxFormSection}>
                <div className={classes.SectionTitle}>
                  <label className={classes.SectionTitleText}>General</label>
                </div>
                <div className={classes.SectionContent}>
                  <div className={classes.SectionRow}>
                    <div className={classes.InputContainer}>
                      <div className={classes.InputLabelContainer}>
                        <label className={classes.InputLabel}>Title</label>
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={handleEditTitle}
                        className={classes.InputField}
                        placeholder="Enter item name"
                      ></input>
                    </div>
                    <div className={classes.InputContainer}>
                      <div className={classes.InputLabelContainer}>
                        <label className={classes.InputLabel}>
                          Invoice number
                        </label>
                      </div>
                      <input
                        type="text"
                        value={factureNr}
                        onChange={handleEditFactureNr}
                        className={classes.InputField}
                        placeholder="Enter invoice number"
                      ></input>
                    </div>
                  </div>
                  <div className={classes.SectionRow}>
                    <div className={classes.InputContainer}>
                      <CustomSelect
                        onChange={handleSelectedCategoryChange}
                        value={selectedCategory}
                        options={backendOptions}
                        label="Category"
                        placeholder="Select item category"
                        styles={customStyles}
                      />
                    </div>
                    <ThemeProvider theme={theme}>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="en-gb"
                      >
                        <div className={classes.StartDate}>
                          <div className={classes.InputLabelContainer}>
                            <label className={classes.InputLabel}>
                              Expiration date
                            </label>
                          </div>
                          <div
                            className={classes.StartDatePicker}
                            style={{ width: "100%" }}
                          >
                            <DesktopDatePicker
                              // label="Starting date"
                              slots={{ openPickerIcon: icon }}
                              value={date}
                              onChange={handleCardExpireOnChange}
                              maxDate={maxDate}
                              className={classes.StartDatePicker}
                            />
                          </div>
                        </div>
                      </LocalizationProvider>
                    </ThemeProvider>
                  </div>
                  <div
                    className={classes.SectionRow}
                    style={{ width: "48.5%" }}
                  >
                    <div className={classes.InputContainer}>
                      <CustomSelect
                        onChange={handleSelectedMoneyChange}
                        value={selectedMoney}
                        options={money}
                        label="Money"
                        placeholder="Select money"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <span className={classes.BoxLine}></span>
              <section className={classes.BoxFormSection}>
                {" "}
                <div className={classes.SectionTitle}>
                  <label className={classes.SectionTitleText}>Stock</label>
                </div>
                <div className={classes.SectionContent}>
                  <div className={classes.SectionRow}>
                    <div className={classes.InputContainer}>
                      <div className={classes.InputLabelContainer}>
                        <label className={classes.InputLabel}>Volume</label>
                      </div>
                      <input
                        type="text"
                        value={volume}
                        onChange={handleEditVolume}
                        className={classes.InputField}
                        placeholder="Enter item name"
                      ></input>
                    </div>
                    <div className={classes.InputContainer}>
                      <CustomSelect
                        onChange={handleSelectedUnitChange}
                        value={selectedUnit}
                        options={units}
                        label="Unit"
                        placeholder="Select unit"
                        styles={customStyles}
                      />
                    </div>
                    <div className={classes.InputContainer}>
                      <div className={classes.InputLabelContainer}>
                        <label className={classes.InputLabel}>
                          Reorder limit
                        </label>
                      </div>
                      <input
                        type="text"
                        value={reoderLimit}
                        onChange={handleEditReorderLimit}
                        className={classes.InputField}
                        placeholder="Enter item name"
                      ></input>
                    </div>
                  </div>
                  {selectedUnit === "pcs" ? (
                    <div className={classes.SectionRow}>
                      <div className={classes.InputContainer}>
                        <div className={classes.InputLabelContainer}>
                          <label className={classes.InputLabel}>
                            Pcs volume
                          </label>
                        </div>
                        <input
                          type="text"
                          value={pcsVolume}
                          onChange={handleEditPcsVolume}
                          className={classes.InputField}
                          placeholder="Enter pcs volume"
                        ></input>
                      </div>
                      <div className={classes.InputContainer}>
                        <CustomSelect
                          onChange={handleSelectedPcsUnitChange}
                          value={selectedPcsUnit}
                          options={Pcsunits}
                          label="Pcs unit"
                          placeholder="Select unit"
                          styles={customStyles}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
              <span className={classes.BoxLine}></span>
              <section className={classes.BoxFormSection}>
                {" "}
                <div className={classes.SectionTitle}>
                  <label className={classes.SectionTitleText}>Pricing</label>
                </div>
                <div className={classes.SectionContent}>
                  <div className={classes.SectionRow}>
                    <div className={classes.InputContainer}>
                      <div className={classes.InputLabelContainer}>
                        <label className={classes.InputLabel}>
                          Price{" "}
                          <span style={{ opacity: "0.35" }}>(with TVA)</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={priceWoutTVA}
                        onChange={handleEditPriceWoutTVA}
                        className={classes.InputField}
                        placeholder="Price value"
                      ></input>
                    </div>
                    <div
                      className={classes.InputContainer}
                      style={{ minWidth: "fit-content" }}
                    >
                      <CustomSelect
                        onChange={handleSelectedTVAChange}
                        value={selectedTVA}
                        options={tvaTypes}
                        label="TVA type"
                        placeholder="Select type"
                        styles={customStyles}
                      />
                    </div>
                    <div className={classes.InputContainer}>
                      <div className={classes.InputLabelContainer}>
                        <label className={classes.InputLabel}>
                          Price{" "}
                          <span style={{ opacity: "0.35" }}>(without TVA)</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={totalPrice}
                        className={classes.InputField}
                        placeholder="Enter price value"
                        readOnly
                      ></input>
                    </div>
                  </div>
                </div>
              </section>
              <span className={classes.BoxLine}></span>
              <section className={classes.BoxFormSection}>
                {" "}
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
                    <div className={classes.SupplierList}>
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
                </div>
              </section>
              <div className={classes.BoxAction}>
                <button
                  className={classes.SaveItemButton}
                  onClick={handleCreateStock}
                  disabled={disabled}
                >
                  <span className={classes.SaveItemText}>Save item</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CreateItem;
