import { ThemeProvider } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { ElementType, useEffect, useState } from "react";
import {
  deleteDocument,
  getImage,
  updateDocument,
  updateVacation,
  updateVacationStatus,
  uploadDocument,
  uploadImage,
} from "../../../../auth/api/requests";
import {
  closeIcon,
  downloadIcon,
  notificationIcon,
} from "../../../../icons/icons";
import theme from "../ScheduleTab/theme";
import classes from "./Documents.module.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";

type Props = {
  employee?: any;
  documents?: any[];
  vacations?: any[];
  onCloseSideBar?: () => void;
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

const Documets = (props: Props) => {
  type Document = {
    id: string;
    key: string;
    number: string;
    type: string;
    expireOn: Date;
    userId: string;
    idnp: number;
    data: any;
  };

  const IdDocument: Document = props.documents?.find(
    (document) => document.type === "ID"
  );

  let idCardDocument: Document = props.documents?.find(
    (document) => document.type === "ID card"
  );
  const applicationForEmployeement: Document = props.documents?.find(
    (document) => document.type === "Application for employment"
  );
  const militaryBook: Document = props.documents?.find(
    (document) => document.type === "Military book"
  );
  const [id, setId] = useState(IdDocument?.number);

  const [cardSerialNumber, setCardSerialNumber] = useState(
    idCardDocument?.number
  );

  const [applicationSerialNumber, setApplicationSerialNumber] = useState(
    applicationForEmployeement?.number
  );
  const [militarySerialNumber, setMilitarySerialNumber] = useState(
    militaryBook?.number
  );
  const [vacationSerialNumber, setVacationSerialNumber] = useState();

  const [cardExpireOn, setCardExpireOn] = useState(
    idCardDocument?.expireOn ? dayjs(idCardDocument.expireOn) : null
  );

  const [applicationExpireOn, setApplicationExpireOn] = useState(
    applicationForEmployeement?.expireOn
      ? dayjs(applicationForEmployeement?.expireOn)
      : null
  );
  const [vacationExpireOn, setVacationExpireOn] = useState();
  // const [type, setType] = useState({
  //   id: { serialNumber: "", type: "ID" },
  //   idCard: { serialNumber: "", type: "ID card" },
  //   employmentApplication: {
  //     serialNumber: "",
  //     type: "Application for employment",
  //   },
  //   militaryBook: { serialNumber: "", type: "Military book" },
  // });

  const [idImage, setIdImage] = useState();
  const [idCardImage, setIdCardImage] = useState();
  const [applicationImage, setApplicationImage] = useState();
  const [militaryImage, setMilitaryImage] = useState();

  useEffect(() => {
    const fetchDocumentImages = async () => {
      try {
        if (IdDocument) {
          const IdImage = await getImage(IdDocument.key);
          setIdImage(IdImage);
        }
        if (idCardDocument) {
          const idCardImage = await getImage(idCardDocument.key);
          setIdCardImage(idCardImage);
        }

        if (applicationForEmployeement) {
          const applicationImage = await getImage(
            applicationForEmployeement?.key
          );
          setApplicationImage(applicationImage);
        }

        if (militaryBook) {
          const militaryImage = await getImage(militaryBook.key);
          setMilitaryImage(militaryImage);
        }
      } catch (error) {
        console.error("Error fetching document images:", error);
      }
    };
    fetchDocumentImages();
  }, [idCardDocument, applicationForEmployeement, militaryBook, IdDocument]);

  const handleCardSerialNumberChange = (event, documentType) => {
    const inputValue = event.target.value;

    const firstLetter = inputValue.charAt(0).toUpperCase();
    const numbersOnly = inputValue.slice(1).replace(/[^0-9]/g, "");

    // Combine the first letter and the numbers
    const formattedValue = firstLetter + numbersOnly;
    setCardSerialNumber(formattedValue);
    // setType(documentType);
  };

  const handleCardIDNPChange = (event, documentType) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9]/g, ""); // Remove all non-numeric characters

    setId(sanitizedValue);
    // setType(documentType);
  };

  const handleApplicationSerialNumberChange = (event, documentType) => {
    setApplicationSerialNumber(event.target.value);
    // setType(documentType);
  };
  const handleMilitarySerialNumberChange = (event, documentType) => {
    setMilitarySerialNumber(event.target.value);
    // setType(documentType);
  };
  const handleVacationSerialNumberChange = (event, documentType) => {
    setVacationSerialNumber(event.target.value);
    // setType(documentType);
  };
  const minYear = 1900;
  const maxYear = 2099;

  // const maxDate = dayjs(`${maxYear}-12-31`);

  const handleCardExpireOnChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setCardExpireOn(newDate);
    } else if (newYear < minYear) {
      setCardExpireOn(newDate.set("year", minYear));
    } else {
      setCardExpireOn(newDate.set("year", maxYear));
    }
  };

  const handleApplicationExpireOnChange = (newDate) => {
    const newYear = newDate.year();

    if (newYear >= minYear && newYear <= maxYear) {
      setApplicationExpireOn(newDate);
    } else if (newYear < minYear) {
      setApplicationExpireOn(newDate.set("year", minYear));
    } else {
      setApplicationExpireOn(newDate.set("year", maxYear));
    }
  };
  const handleVacationExpireOnChange = (newDate) => {
    setVacationExpireOn(newDate);
  };

  const handleUploadButtonClick = async (inputId) => {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  };

  const notify = () =>
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

  const handleFileUpload = async (event, documentType) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (
        (documentType === "ID" && IdDocument && IdDocument.key !== "") ||
        (documentType === "ID card" &&
          idCardDocument &&
          idCardDocument.key !== "") ||
        (documentType === "Application for employment" &&
          applicationForEmployeement &&
          applicationForEmployeement.key !== "") ||
        (documentType === "Military book" &&
          militaryBook &&
          militaryBook.key !== "")
      ) {
        const confirmations: boolean[] = [];

        // Function to show a confirmation dialog and return a Promise
        const showConfirmationDialog = (message: string) => {
          return new Promise<boolean>((resolve) => {
            if (window.confirm(message)) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        };

        // Show the first confirmation dialog
        const firstConfirmation: boolean = await showConfirmationDialog(
          "The document has already been uploaded. Continue?"
        );
        confirmations.push(firstConfirmation);

        if (firstConfirmation) {
          const secondConfirmation: boolean = await showConfirmationDialog(
            "Are you sure?"
          );
          confirmations.push(secondConfirmation);
        }

        if (confirmations.every(Boolean)) {
          try {
            const formData = new FormData();
            formData.append("file", selectedFile, selectedFile.name);
            const imageKey = await uploadImage(formData);
            notify();

            const documentData = {
              type: documentType,
              number:
                documentType === "ID"
                  ? id
                  : documentType === "ID card"
                  ? cardSerialNumber
                  : documentType === "Application for employment"
                  ? applicationSerialNumber
                  : documentType === "Military book"
                  ? militarySerialNumber
                  : vacationSerialNumber,
              expireOn:
                documentType === "ID"
                  ? dayjs(cardExpireOn).format("YYYY-MM-DD")
                  : documentType === "ID card"
                  ? dayjs(cardExpireOn).format("YYYY-MM-DD")
                  : documentType === "Application for employment"
                  ? dayjs(applicationExpireOn).format("YYYY-MM-DD")
                  : documentType === "Military book"
                  ? null
                  : dayjs(vacationExpireOn).format("YYYY-MM-DD"),
              key: imageKey,
              userId: props.employee.id,
            };

            event.target.value = "";

            // Proceed with the upload if there is no confirmation message or if the user confirms
            await updateDocument(
              documentType === "ID"
                ? IdDocument?.id
                : documentType === "ID card"
                ? idCardDocument?.id
                : documentType === "Application for employment"
                ? applicationForEmployeement?.id
                : documentType === "Military book"
                ? militaryBook?.id
                : "",
              documentData
            );
          } catch (error) {
            console.error("Error uploading image or vacation:", error);
          }
        } else {
          console.log("Confirmation denied. File not uploaded.");
        }
      } else {
        // No key exists for vacation, so upload the file without confirmation
        try {
          const formData = new FormData();
          formData.append("file", selectedFile, selectedFile.name);
          const imageKey = await uploadImage(formData);

          const documentData = {
            type: documentType,
            number:
              documentType === "ID"
                ? id
                : documentType === "ID card"
                ? cardSerialNumber
                : documentType === "Application for employment"
                ? applicationSerialNumber
                : documentType === "Military book"
                ? militarySerialNumber
                : vacationSerialNumber,
            expireOn:
              documentType === "ID"
                ? dayjs(cardExpireOn).format("YYYY-MM-DD")
                : documentType === "ID card"
                ? dayjs(cardExpireOn).format("YYYY-MM-DD")
                : documentType === "Application for employment"
                ? dayjs(applicationExpireOn).format("YYYY-MM-DD")
                : documentType === "Military book"
                ? null
                : dayjs(vacationExpireOn).format("YYYY-MM-DD"),
            key: imageKey,
            userId: props.employee.id,
          };

          event.target.value = "";

          // Proceed with the upload if there is no confirmation message or if the user confirms
          await uploadDocument(documentData);
          notify();
        } catch (error) {
          console.error("Error uploading image or vacation:", error);
        }
      }
    } else {
      console.log("No file selected");
    }
  };

  const handleChangeVacationStatus = async (vacationId) => {
    try {
      const vacationData = {
        vacationStatus: "DECLINED",
      };
      const vacationStatusResponse = await updateVacationStatus(
        vacationId,
        vacationData
      );
      console.log("Vacation Status changed:", vacationStatusResponse);
    } catch (error) {
      console.error("Can't update status:", error);
    }
  };

  const handleVacationFileUpload = async (event, vacation) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (vacation.key) {
        const confirmations: boolean[] = [];

        // Function to show a confirmation dialog and return a Promise
        const showConfirmationDialog = (message: string) => {
          return new Promise<boolean>((resolve) => {
            if (window.confirm(message)) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        };

        // Show the first confirmation dialog
        const firstConfirmation: boolean = await showConfirmationDialog(
          "The document has already been uploaded. Continue?"
        );
        confirmations.push(firstConfirmation);

        if (firstConfirmation) {
          // Show the second confirmation dialog
          const secondConfirmation: boolean = await showConfirmationDialog(
            "Are you sure?"
          );
          confirmations.push(secondConfirmation);
        }

        // Check if both confirmations are true before uploading the file
        if (confirmations.every(Boolean)) {
          try {
            const formData = new FormData();
            formData.append("file", selectedFile, selectedFile.name);
            const imageKey = await uploadImage(formData);

            const vacationData = {
              ...vacation,
              key: imageKey,
              status: "APPROVED",
            };

            const vacationUploadResponse = await updateVacation(
              vacation.id,
              vacationData
            );
            event.target.value = "";

            console.log("Vacation uploaded:", vacationUploadResponse);
          } catch (error) {
            console.error("Error uploading image or vacation:", error);
          }
        } else {
          console.log("Confirmation denied. File not uploaded.");
        }
      } else {
        // No key exists for vacation, so upload the file without confirmation
        try {
          const formData = new FormData();
          formData.append("file", selectedFile, selectedFile.name);
          const imageKey = await uploadImage(formData);

          const vacationData = {
            ...vacation,
            key: imageKey,
            status: "APPROVED",
          };

          const vacationUploadResponse = await updateVacation(
            vacation.id,
            vacationData
          );
          event.target.value = "";

          console.log("Vacation uploaded:", vacationUploadResponse);
        } catch (error) {
          console.error("Error uploading image or vacation:", error);
        }
      }
    } else {
      console.log("No file selected");
    }
  };

  const [vacations, setVacations] = useState(props.vacations);

  useEffect(() => {
    const fetchVacationImages = async () => {
      try {
        if (props.vacations) {
          const vacationImages = await Promise.all(
            props.vacations.map(async (vacation) => {
              if (vacation.key) {
                const image = await getImage(vacation.key);
                return { ...vacation, image };
              }
              return vacation;
            })
          );

          setVacations(vacationImages);
        }
      } catch (error) {
        console.error("Error fetching vacation document images:", error);
      }
    };

    fetchVacationImages();
  }, [props.vacations]);

  const idChanged = IdDocument
    ? (id !== IdDocument?.number && id !== undefined) ||
      (dayjs(cardExpireOn).format("YYYY-MM-DD") !==
        dayjs(idCardDocument?.expireOn).format("YYYY-MM-DD") &&
        cardExpireOn !== null)
    : false;

  const CardIdChanged = idCardDocument
    ? (cardSerialNumber !== idCardDocument.number &&
        cardSerialNumber !== undefined) ||
      (dayjs(cardExpireOn).format("YYYY-MM-DD") !==
        dayjs(idCardDocument.expireOn).format("YYYY-MM-DD") &&
        cardExpireOn !== null)
    : false;

  const ApplicationChanged = applicationForEmployeement
    ? (applicationSerialNumber !== applicationForEmployeement.number &&
        applicationSerialNumber !== undefined) ||
      (dayjs(applicationExpireOn).format("YYYY-MM-DD") !==
        dayjs(applicationForEmployeement.expireOn).format("YYYY-MM-DD") &&
        applicationExpireOn !== null)
    : false;

  const MilitaryChanged = militaryBook
    ? militarySerialNumber !== militaryBook.number &&
      militarySerialNumber !== undefined
    : false;

  const disableButton =
    idChanged === true ||
    CardIdChanged === true ||
    ApplicationChanged === true ||
    MilitaryChanged === true;

  const handleUpdateDocument = async () => {
    const updatePromises: Promise<Document>[] = [];

    if (idChanged === true) {
      const documentData0 = {
        number: id,
        expireOn: cardExpireOn,
        userId: props.employee.id,
      };
      updatePromises.push(updateDocument(IdDocument.id, documentData0));
    }

    if (CardIdChanged === true) {
      const documentData1 = {
        number: cardSerialNumber,
        expireOn: cardExpireOn,
        userId: props.employee.id,
      };
      updatePromises.push(updateDocument(idCardDocument.id, documentData1));
    }

    if (ApplicationChanged === true) {
      const documentData2 = {
        number: applicationSerialNumber,
        expireOn: applicationExpireOn,
        userId: props.employee.id,
      };
      updatePromises.push(
        updateDocument(applicationForEmployeement.id, documentData2)
      );
    }

    if (MilitaryChanged === true) {
      const documentData3 = {
        number: militarySerialNumber,
        userId: props.employee.id,
      };
      updatePromises.push(updateDocument(militaryBook.id, documentData3));
    }

    try {
      const updatedDocuments = await Promise.all(updatePromises);
      updatedDocuments.forEach((document) => {
        if (document.type === "ID card") {
          idCardDocument = document;
        }
      });

      notify();
      return updatedDocuments.map((response) => response.data);
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      if (documentId === idCardDocument.id || documentId === IdDocument.id) {
        await deleteDocument(idCardDocument.id);
        await deleteDocument(IdDocument.id);
      } else {
        await deleteDocument(documentId);
      }
      props.onCloseSideBar ? props.onCloseSideBar() : console.log("Cant close");
      notify();
    } catch (error) {
      console.error("Can't delete document");
    }
  };

  return (
    <div className={classes.DocumentsContent}>
      <div className={classes.DocumentList}>
        <div className={classes.DocumentItem}>
          <div className={classes.DocumentTitle}>
            <span className={classes.DocumentTitleText}>
              <a
                style={{ textDecoration: "none" }}
                href={idImage}
                className={IdDocument?.key ? classes.Hover : classes.NotHover}
              >
                ID
              </a>
            </span>
          </div>
          <div className={classes.DocumentSelectGroup}>
            <span className={classes.Line}></span>
            <div className={classes.SerialNumber}>
              <div className={classes.SerialNumberInput}>
                <input
                  className={classes.SerialNumberComtent}
                  placeholder="IDNP"
                  value={id}
                  onChange={(event) => handleCardIDNPChange(event, "ID")}
                  maxLength={20}
                ></input>
              </div>
            </div>
            <span className={classes.Line}></span>
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <DesktopDatePicker
                  label="Expire on"
                  slots={{ openPickerIcon: icon }}
                  value={cardExpireOn || id}
                  onChange={handleCardExpireOnChange}
                />
              </LocalizationProvider>
            </ThemeProvider>
            <span className={classes.Line}></span>
          </div>
          <div className={classes.DocumentActions}>
            <input
              type="file"
              id="IDImage"
              accept="image/*, .pdf"
              style={{ display: "none" }}
              onChange={(event) => handleFileUpload(event, "ID")}
            />
            <button
              className={classes.NotificationButton}
              onClick={() => handleDeleteDocument(IdDocument.id)}
            >
              {closeIcon}
            </button>
            <button
              className={classes.UploadButton}
              onClick={() => handleUploadButtonClick("IDImage")}
            >
              {downloadIcon} Upload
            </button>
          </div>
        </div>
        <div className={classes.DocumentItem}>
          <div className={classes.DocumentTitle}>
            <span className={classes.DocumentTitleText}>
              <a
                style={{ textDecoration: "none" }}
                href={idCardImage}
                className={
                  idCardDocument?.key ? classes.Hover : classes.NotHover
                }
              >
                ID Card
              </a>
            </span>
          </div>
          <div className={classes.DocumentSelectGroup}>
            <span className={classes.Line}></span>
            <div className={classes.SerialNumber}>
              <div className={classes.SerialNumberInput}>
                <input
                  className={classes.SerialNumberComtent}
                  placeholder="ID number"
                  value={cardSerialNumber}
                  onChange={(event) =>
                    handleCardSerialNumberChange(event, "ID card")
                  }
                  maxLength={20}
                ></input>
              </div>
            </div>
            <span className={classes.Line}></span>
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <DesktopDatePicker
                  label="Expire on"
                  slots={{ openPickerIcon: icon }}
                  value={cardExpireOn}
                  onChange={handleCardExpireOnChange}
                />
              </LocalizationProvider>
            </ThemeProvider>
            <span className={classes.Line}></span>
          </div>
          <div className={classes.DocumentActions}>
            <input
              type="file"
              id="IDCardImage"
              accept="image/*, .pdf"
              style={{ display: "none" }}
              onChange={(event) => handleFileUpload(event, "ID card")}
            />
            <button
              className={classes.NotificationButton}
              onClick={() => handleDeleteDocument(idCardDocument.id)}
            >
              {closeIcon}
            </button>
            <button
              className={classes.UploadButton}
              onClick={() => handleUploadButtonClick("IDCardImage")}
            >
              {downloadIcon} Upload
            </button>
          </div>
        </div>
        <div className={classes.DocumentItem}>
          <div className={classes.DocumentTitle}>
            <span className={classes.DocumentTitleText}>
              <a
                style={{ textDecoration: "none" }}
                href={applicationImage}
                className={
                  applicationForEmployeement?.key
                    ? classes.Hover
                    : classes.NotHover
                }
              >
                Application for employment
              </a>
            </span>
          </div>
          <div className={classes.DocumentSelectGroup}>
            <span className={classes.Line}></span>
            <div className={classes.SerialNumber}>
              <div className={classes.SerialNumberInput}>
                <input
                  className={classes.SerialNumberComtent}
                  placeholder="ID number"
                  value={applicationSerialNumber}
                  onChange={(event) =>
                    handleApplicationSerialNumberChange(
                      event,
                      "Application for employment"
                    )
                  }
                  maxLength={20}
                ></input>
              </div>
            </div>
            <span className={classes.Line}></span>
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <DesktopDatePicker
                  label="Expire on"
                  slots={{ openPickerIcon: icon }}
                  value={applicationExpireOn}
                  onChange={handleApplicationExpireOnChange}
                />
              </LocalizationProvider>
            </ThemeProvider>
            <span className={classes.Line}></span>
          </div>
          <div className={classes.DocumentActions}>
            <input
              type="file"
              id="ApplicationImage"
              accept="image/*, .pdf"
              style={{ display: "none" }}
              onChange={(event) =>
                handleFileUpload(event, "Application for employment")
              }
            />
            <button
              className={classes.NotificationButton}
              onClick={() =>
                handleDeleteDocument(applicationForEmployeement.id)
              }
            >
              {closeIcon}
            </button>
            <button
              className={classes.UploadButton}
              onClick={() => handleUploadButtonClick("ApplicationImage")}
            >
              {downloadIcon} Upload
            </button>
          </div>
        </div>
        <div className={classes.DocumentItem}>
          <div className={classes.DocumentTitle}>
            <span className={classes.DocumentTitleText}>
              <a
                style={{ textDecoration: "none" }}
                href={militaryImage}
                className={militaryBook?.key ? classes.Hover : classes.NotHover}
              >
                Military book
              </a>
            </span>
          </div>
          <div className={classes.DocumentSelectGroup}>
            <span className={classes.Line}></span>
            <div className={classes.MilitarySerialNumber}>
              <div className={classes.SerialNumberInput}>
                <input
                  className={classes.SerialNumberComtent}
                  placeholder="Serial number"
                  value={militarySerialNumber}
                  onChange={(event) =>
                    handleMilitarySerialNumberChange(event, "Military book")
                  }
                  maxLength={20}
                ></input>
              </div>
            </div>
            <span className={classes.Line}></span>
          </div>
          <div className={classes.DocumentActions}>
            <input
              type="file"
              id="MilitaryImage"
              accept="image/*, .pdf"
              style={{ display: "none" }}
              onChange={(event) => handleFileUpload(event, "Military book")}
            />
            <button
              className={classes.NotificationButton}
              onClick={() => handleDeleteDocument(militaryBook.id)}
            >
              {closeIcon}
            </button>
            <button
              className={classes.UploadButton}
              onClick={() => handleUploadButtonClick("MilitaryImage")}
            >
              {downloadIcon} Upload
            </button>
          </div>
        </div>
        <>
          {vacations
            ?.filter((vacation) => vacation.vacationStatus !== "DECLINED")
            ?.filter((vacation) => vacation.endDate !== null)
            .sort((a, b) => {
              const endDateA = new Date(a.endDate).getTime();
              const startDateB = new Date(b.endDate).getTime();
              if (isNaN(endDateA)) return 1; // Handle invalid dates
              if (isNaN(startDateB)) return -1; // Handle invalid dates
              if (endDateA > startDateB) return -1;
              if (endDateA < startDateB) return 1;
              return 0;
            })
            ?.map((vacation, index) => (
              <div key={vacation.id} className={classes.DocumentItem}>
                <div className={classes.DocumentTitle}>
                  <span className={classes.DocumentTitleTextV}>
                    <a
                      style={{ textDecoration: "none" }}
                      href={vacation.image}
                      className={
                        vacation?.key ? classes.Hover : classes.NotHover
                      }
                    >
                      {vacation?.key ? "Vacation order" : "Vacation request"}
                    </a>
                  </span>
                  <span className={classes.VacationID}>
                    {vacation.vacationIdentifier}
                  </span>
                </div>
                <div className={classes.DocumentSelectGroup}>
                  <span className={classes.Line}></span>
                  <div className={classes.SerialNumber}>
                    <div className={classes.SerialNumberInput}>
                      <input
                        className={classes.SerialNumberComtent}
                        placeholder="ID number"
                        value={vacationSerialNumber}
                        readOnly
                        defaultValue={vacation.id.substring(0, 8)}
                        onChange={(event) =>
                          handleVacationSerialNumberChange(
                            event,
                            "Vacation request"
                          )
                        }
                        maxLength={20}
                      ></input>
                    </div>
                  </div>
                  <span className={classes.Line}></span>
                  <ThemeProvider theme={theme}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="en-gb"
                    >
                      <DesktopDatePicker
                        label="Expire on"
                        slots={{ openPickerIcon: icon }}
                        value={vacationExpireOn}
                        onChange={handleVacationExpireOnChange}
                        defaultValue={dayjs(vacation.endDate)}
                      />
                    </LocalizationProvider>
                  </ThemeProvider>
                  <span className={classes.Line}></span>
                </div>
                <div className={classes.DocumentActions}>
                  <input
                    type="file"
                    id={`VacationImage${index}`}
                    accept="image/*, .pdf"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleVacationFileUpload(event, vacation)
                    }
                  />
                  {vacation.vacationStatus === "WAITING" ? (
                    <button
                      className={classes.NotificationButton}
                      onClick={() => handleChangeVacationStatus(vacation.id)}
                    >
                      {closeIcon}
                    </button>
                  ) : (
                    <button className={classes.NotificationButton}>
                      {notificationIcon}
                    </button>
                  )}

                  <button
                    className={classes.UploadButton}
                    onClick={() =>
                      handleUploadButtonClick(`VacationImage${index}`)
                    }
                  >
                    {downloadIcon} Upload
                  </button>
                </div>
              </div>
            ))}
        </>
      </div>
      <button
        className={classes.SaveChangesButton}
        onClick={handleUpdateDocument}
        disabled={!disableButton}
      >
        Save changes
      </button>
    </div>
  );
};

export default Documets;
