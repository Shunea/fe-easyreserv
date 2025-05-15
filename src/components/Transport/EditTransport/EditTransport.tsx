import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { closeIcon } from "../../../icons/icons";
import OutsideClickHandler from "../../Staff/components/OutsideClickHandler";
import Documents from "../DocumentsTransport/Documents";
import classes from "../DetailsTransport/TransportDetails.module.css";
import classesCreate from "../CreateTransport/CreateTransport.module.css";
import CustomSelectStyles from "src/components/Staff/EditEmployee/components/CustomSelectStyles";
import CustomSelect from "src/components/Staff/EditEmployee/components/CustomSelect";
import ShowDriver from "../DriverTransport/ShowDriver";
import {
  createTransport,
  getDocuments,
  getTransportById,
  updateTransport,
  userData,
} from "src/auth/api/requests";
import { Restaurant } from "src/Types";
import { Employee } from "src/components/Staff/StaffTypes";

type Props = {
  handleClose: () => void;
  transportArray: any[];
  transportId: string;
  setTransportArray?: any;
};
type User = {
  id: string;
  username: string;
  avatar: string;
};
type Invoice = {
  id: string;
  documentName: string;
  key: string;
  number: string;
  expireOn: string;
  itemId: string;
};
type Transport = {
  registrationNumber: string;
  type: string;
  seats: string;
  mileage: string;
  users: Employee[];
  localSerialNumber: string;
  image: string;
  invoiceNumber: string;
  document: Invoice[];
};
const EditTransport = ({
  handleClose,
  transportId,
  transportArray,
  setTransportArray,
}: Props) => {
  const BoxRef = useRef<HTMLDivElement | null>(null);

  const [transport, setTransport] = useState<Transport>();
  const [docs, setDocs] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchDataDocuments = async () => {
      try {
        const response = await getDocuments();

        // Filter documents by type "transport"
        let transportDocuments = response.data.filter(
          (doc) => doc.type === "transport"
        );
        if (transportId) {
          transportDocuments = transportDocuments.filter(
            (doc) => doc.itemId === transportId
          );
        }
        setDocs(transportDocuments);
        setDocsLength(transportDocuments.length);
      } catch (error) {
        console.error("Can't get transport:", error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await getTransportById(transportId);
        const userIDs = response.users;
        setSelectedDrivers(userIDs);
        setTransport(response);
        setRegistrationNumber(response.registrationNumber);
        setMileage(response.mileage);
        setSelectedSeats(response.seats);
        setType(response.type);
        setSelectedRegion(response.region);
      } catch (error) {
        console.error("Can't get transport:", error);
      }
    };
    fetchDataDocuments();
    fetchData();
  }, [transportId]);
  const [activeTab, setActiveTab] = useState("details");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [docsLength, setDocsLength] = useState(0);
  const seatsOptions = [
    {
      value: 2,
      label: "2",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 6,
      label: "6",
    },
  ];
  const [initialRegistrationNumber, setInitialRegistrationNumber] =
    useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const handleEditRegistrationNumber = (e) => {
    setRegistrationNumber(e.target.value);
  };
  useEffect(() => {
    if (transport) {
      setInitialRegistrationNumber(transport.registrationNumber);
      setRegistrationNumber(transport.registrationNumber);
    }
  }, [transport]);
  const [mileage, setMileage] = useState("");
  const handleEditMileage = (e) => {
    setMileage(e.target.value);
  };

  const [type, setType] = useState("");
  const handleEditType = (e) => {
    setType(e.target.value);
  };

  // State to manage the selected option
  const [selectedSeats, setSelectedSeats] = useState("");
  const handleSelectedSeatsChange = (selectedOption: any) => {
    setSelectedSeats(selectedOption.value);
  };

  const [selectedRegion, setSelectedRegion] = useState("");
  const handleSelectedRegionChange = (selectedOption: any) => {
    setSelectedRegion(selectedOption.value);
  };
  const regionOptions = [
    // { value: "All Regions", label: "All regions" },
    { value: "Zona Nord", label: "Zona Nord" },
    { value: "Zona Centru", label: "Zona Centru" },
    { value: "Zona Sud", label: "Zona Sud" },
  ];
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      setSelectedRestaurant(selectedRestaurantFromCookie);
    }
  }, []);

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

  const handleUpdateTransport = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const transportData: any = {
        seats: selectedSeats,
        mileage: mileage,
        region: selectedRegion,
        type: type,
        userIds: selectedDrivers.map((driver) => driver.id),
      };
      if (registrationNumber !== initialRegistrationNumber) {
        transportData.registrationNumber = registrationNumber;
      } else {
      }

      const updatedTransport = await updateTransport(
        transportData,
        transportId
      );

      handleClose();
      success();
    } catch (error) {
      console.error("Can't update transport:", error);
    }
  };

  const disabled =
    transportId === "" ||
    selectedSeats === "" ||
    type === "" ||
    mileage === "" ||
    selectedRegion === "";

  const [selectedDrivers, setSelectedDrivers] = useState<userData[]>([]);

  // Function to handle setting selected driver
  const handleSelectDrivers = (driver) => {
    setSelectedDrivers(driver);
  };

  return (
    <>
      <div className={classes.Modal}>
        <div className={classes.Box} ref={BoxRef}>
          <OutsideClickHandler innerRef={BoxRef} onClose={handleClose} />

          <div className={classes.BoxHead}>
            <p className={classes.BoxHeadTitle}>
              Edit Transport · {transport?.registrationNumber}
            </p>
            <div className={classes.BoxHeadButtonContainer}>
              <button className={classes.BoxHeadButton} onClick={handleClose}>
                {closeIcon}
              </button>
            </div>
          </div>
          <div className={classes.BoxList}>
            <div
              className={`${classes.BoxListItem} ${
                activeTab === "details" ? classes.ActiveTab : ""
              }`}
              onClick={() => handleTabClick("details")}
            >
              <p className={classes.BoxListItemText}>Details</p>
            </div>
            {/* <div
              className={`${classes.BoxListItem} ${
                activeTab === "drivers" ? classes.ActiveTab : ""
              }`}
              onClick={() => handleTabClick("drivers")}
            >
              <p className={classes.BoxListItemText}>Drivers</p>
            </div> */}
            <div
              className={`${classes.BoxListItem} ${
                activeTab === "documents" ? classes.ActiveTab : ""
              }`}
              onClick={() => handleTabClick("documents")}
            >
              <p className={classes.BoxListItemText}>Documents </p>{" "}
              <p className={classes.BoxListItemText} style={{ opacity: "0.2" }}>
                · {docsLength}
              </p>
            </div>
          </div>
          {activeTab === "details" ? (
            <>
              <div
                className={`${classesCreate.BoxForm} ${classesCreate.BoxFormContainer}`}
              >
                <section className={classesCreate.BoxFormSection}>
                  <div className={classesCreate.SectionContent}>
                    <div className={classesCreate.SectionRow}>
                      <div className={classesCreate.InputContainer}>
                        <div className={classesCreate.InputLabelContainer}>
                          <label className={classesCreate.InputLabel}>
                            Transport ID
                          </label>
                        </div>
                        <input
                          type="text"
                          value={registrationNumber}
                          onChange={handleEditRegistrationNumber}
                          className={classesCreate.InputField}
                          placeholder="Enter transport ID"
                        ></input>
                      </div>
                      <div className={classesCreate.InputContainer}>
                        <CustomSelect
                          onChange={handleSelectedSeatsChange}
                          value={selectedSeats}
                          options={seatsOptions}
                          label="Seats"
                          placeholder="Select seats number"
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className={classesCreate.SectionRow}>
                      <div className={classesCreate.InputContainer}>
                        <div className={classesCreate.InputLabelContainer}>
                          <label className={classesCreate.InputLabel}>
                            Mileage
                          </label>
                        </div>
                        <input
                          type="number"
                          value={mileage}
                          onChange={handleEditMileage}
                          className={classesCreate.InputField}
                          placeholder="Enter mileage number"
                        ></input>
                      </div>
                      <div className={classesCreate.InputContainer}>
                        <CustomSelect
                          onChange={handleSelectedRegionChange}
                          value={selectedRegion}
                          options={regionOptions}
                          label="Region"
                          placeholder="Select region"
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className={classesCreate.SectionRow}>
                      <div className={classesCreate.InputContainer}>
                        <div className={classesCreate.InputLabelContainer}>
                          <label className={classesCreate.InputLabel}>
                            Car Type
                          </label>
                        </div>
                        <input
                          type="text"
                          value={type}
                          onChange={handleEditType}
                          className={classesCreate.InputField}
                          placeholder="Enter car type"
                        ></input>
                      </div>
                    </div>
                  </div>
                </section>
                <ShowDriver
                  handleClose={handleClose}
                  transportArray={transportArray}
                  selectedDrivers={selectedDrivers}
                  onSelectDrivers={handleSelectDrivers}
                />
                <div className={classesCreate.BoxAction}>
                  <button
                    className={classesCreate.SaveItemButton}
                    onClick={handleUpdateTransport}
                    disabled={disabled}
                  >
                    <span className={classesCreate.SaveItemText}>
                      Update transport
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            // ) : activeTab === "drivers" ? (
            //   <ShowDriver
            //     handleClose={handleClose}
            //     transportArray={transportArray}
            //   />
            <div className={classes.BoxForm}>
              <Documents
                setDocsLength={setDocsLength}
                transportId={transportId}
                transportArray={transportArray}
                docLength={docsLength}
                documents={docs}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default EditTransport;
