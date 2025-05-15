import { useState } from "react";
import { toast } from "react-toastify";
import { createDocument, uploadImage } from "../../auth/api/requests";
import { downloadIcon, invoiceIcon } from "../../icons/icons";
import classes from "./Document.module.css";

type Props = {
  documentName: string;
  serialNumber: string;
  issuedOn: string;
  updateInvoices: (newDocument) => void;
  deleteAddedDocument: (number) => void;
  setDocsLength: (length) => void;
  doscLength: number;
  stockId: string;
};
const Document = (props: Props) => {
  const [localDocumentName, setLocalDocumentName] = useState(
    props.documentName
  );
  const [localSerialNumber, setLocalSerialNumber] = useState(
    props.serialNumber
  );
  const [localIssuedOn, setLocalIssuedOn] = useState(props.issuedOn);
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

  const handleIssuedOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIssuedOn(event.target.value);
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
        const documentData = {
          itemId: props.stockId,
          documentName: localDocumentName,
          key: imageKey,
          number: localSerialNumber,
          issuedOn: localIssuedOn,
          type: "invoice",
        };
        const createdDocument = await createDocument(documentData);
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

  return (
    <div className={classes.InvoiceRow}>
      <div className={classes.InvoiceItem}>
        <div className={classes.TitleContainer}>
          <span className={classes.DocumentIcon}>{invoiceIcon}</span>
          <input
            type="text"
            value={localDocumentName}
            onChange={handleDocumentNameChange}
            className={classes.InputField}
            placeholder="Enter name"
            style={{ maxWidth: "97px" }}
          ></input>
        </div>
        <span className={classes.Line}></span>
        <div className={classes.SerialContainer}>
          <span className={classes.SerialText}>Serial number</span>
          <input
            type="text"
            value={localSerialNumber}
            onChange={handleSerialNumberChange}
            className={classes.InputField}
            placeholder="Enter number"
            style={{ maxWidth: "108px" }}
          ></input>
        </div>
        <span className={classes.Line}></span>
        <div className={classes.TimeContainer}>
          <span className={classes.TimeText}>Issued on</span>
          <input
            type="text"
            value={localIssuedOn}
            onChange={handleIssuedOnChange}
            className={classes.InputField}
            placeholder="Enter number"
            style={{ maxWidth: "137px" }}
          ></input>
        </div>
        <span className={classes.Line}></span>
        <input
          type="file"
          id="IDImage"
          accept="image/*, .pdf"
          style={{ display: "none" }}
          onChange={(event) => handleCreateDocument(event)}
        />
        <button
          className={classes.Download}
          onClick={() => handleUploadButtonClick("IDImage")}
        >
          {downloadIcon}
        </button>
      </div>
    </div>
  );
};
export default Document;
