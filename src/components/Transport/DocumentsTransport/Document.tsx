import { ElementType, useState } from "react";
import { toast } from "react-toastify";
import { createDocument, uploadImage } from "../../../auth/api/requests";
import {
  downloadIcon,
  NotificationsIcon,
  TransportDateIcon,
} from "../../../icons/icons";
import classes from "./Document.module.css";
import {
  CalendarIcon,
  DateField,
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import {
  InputAdornment,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import theme from "./theme";
import CustomSelect from "src/components/Staff/EditEmployee/components/CustomSelect";
import CustomSelectStyles from "src/components/Staff/EditEmployee/components/CustomSelectStyles";

type Props = {
  documentName: string;
  serialNumber: string;
  expireOn: string;
  updateInvoices: (newDocument) => void;
  deleteAddedDocument: (number) => void;
  setDocsLength: (length) => void;
  doscLength: number;
  transportArray: any[];
  transportId: string;
};
const Document = (props: Props) => {
  const [localDocumentName, setLocalDocumentName] = useState(
    props.documentName
  );

  const [localSerialNumber, setLocalSerialNumber] = useState(
    props.serialNumber
  );
  const [localExpireOn, setLocalExpireOn] = useState(props.expireOn);
  const [date, setDate] = useState(props.expireOn);
  const minYear = 1900;
  const maxYear = 2099;

  const maxDate = dayjs(`${maxYear}-12-31`);
  const handleDocumentNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalDocumentName(event.target.value);
  };
  const handleSerialNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalSerialNumber(event.target.value);
  };

  // const handleExpireOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setLocalExpireOn(event.target.value);
  // };
  const handleExpireOnChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setDate(newDate);
    } else if (newYear < minYear) {
      setDate(newDate.set("year", minYear));
    } else {
      setDate(newDate.set("year", maxYear));
    }
  };

  const succes = () =>
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

  const handleCreateDocument = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);
        const imageKey = await uploadImage(formData);
        const selectedTransport = props.transportArray.find(
          (transport) => transport.registrationNumber === selectedTransportName
        );
        if (!selectedTransport) {
          console.error("Selected transport not found");
          return;
        }
        const documentData = {
          itemId: selectedTransport.id,
          documentName: localDocumentName,
          key: imageKey,
          number: localSerialNumber,
          expireOn: dayjs(date).format("YYYY-MM-DD"),
          type: "transport",
        };
        // console.log("Document Data:", documentData);

        const createdDocument = await createDocument(documentData);
        // console.log("Created Document:", createdDocument);

        props.deleteAddedDocument(createdDocument.number);
        props.updateInvoices(createdDocument);
        props.setDocsLength(props.doscLength + 1);
        succes();
      } catch (error) {
        console.error("Can't create document", error);
      }
    } else {
      window.alert("No file selected");
    }
  };
  const handleUploadButtonClick = async (inputId) => {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  };
  const [selectedTransportName, setSelectedTransportName] = useState("");
  const handleSelectedTransportNameChange = (selectedOption: any) => {
    setSelectedTransportName(selectedOption.value);
  };
  const backendOptions = props.transportArray.map((transport) => ({
    value: transport.registrationNumber,
    label: transport.registrationNumber,
  }));

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
  return (
    <div className={classes.InvoiceRow}>
      <div className={classes.InputContainer}>
          <CustomSelect
            onChange={handleSelectedTransportNameChange}
            value={selectedTransportName}
            options={backendOptions}
            // label="Transport Name"
            placeholder="Transport Name"
            styles={customStyles}
          />
        </div>
      <div className={classes.InvoiceItem}>
        <div className={classes.TitleContainer}>
          <input
            type="text"
            value={localDocumentName}
            onChange={handleDocumentNameChange}
            className={classes.InputField}
            placeholder="Enter name"
            style={{ maxWidth: "132px" }}
          ></input>
        </div>
        <span className={classes.Line}></span>
        <div className={classes.SerialContainer}>
          <input
            type="text"
            value={localSerialNumber}
            onChange={handleSerialNumberChange}
            className={classes.InputField}
            placeholder="Serial number"
            style={{ maxWidth: "130px" }}
          ></input>
        </div>
        <span className={classes.Line}></span>
        <div className={classes.TimeContainer}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  slots={{ openPickerIcon: icon }}
                  label="Expiration Date"
                  value={date}
                  onChange={handleExpireOnChange}
                  maxDate={maxDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          </ThemeProvider>
        </div>
        <span className={classes.Line}></span>
        <input
          type="file"
          id="IDImage"
          accept="image/*, .pdf"
          style={{ display: "none" }}
          onChange={(event) => handleCreateDocument(event)}
        />
        <button className={classes.NotificationButton}>
          <span className={classes.NotificationIcon}>{NotificationsIcon}</span>
        </button>
        <button
          className={classes.Download}
          onClick={() => handleUploadButtonClick("IDImage")}
        >
          {downloadIcon}
          Upload
        </button>
      </div>
    </div>
  );
};
export default Document;
