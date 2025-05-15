import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getDocuments, getTransportById } from "../../../auth/api/requests";
import { downloadIcon, invoiceIcon, plusIcon } from "../../../icons/icons";
import Document from "./Document";
import classes from "./Documents.module.css";
import { Employee } from "src/components/Staff/StaffTypes";

type Props = {
  setDocsLength: (length) => void;
  transportId: string;
  transportArray: any[];
  documents: Invoice[] | undefined;
  docLength: number;
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
const Documents = (props: Props) => {
  const [invoices, setInvoices] = useState<Invoice[]>(
    props.documents ? props.documents : []
  );
  const updateInvoices = (newInvoice) => {
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
    props.setDocsLength(invoices.length);
  };

  const [addedDocuments, setAddedDocuments] = useState<Invoice[]>([]);
  const handleAddNewDocuments = () => {
    const newDocument = {
      id: `${addedDocuments.length + 1}`,
      type: "transport",
      documentName: "",
      number: "",
      expireOn: "",
      itemId: "",
      key: "",
    };
    setAddedDocuments([...addedDocuments, newDocument]);
  };
  const [transport, setTransport] = useState<Transport>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransportById(props.transportId);
        setTransport(response);
      } catch (error) {
        console.error("Can't get transport:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAddedDocument = () => {
    setAddedDocuments((prevDocuments) => {
      return prevDocuments.filter((document) => document.number !== "");
    });
  };

  const handleDownload = (key: string) => {
    // Function to initiate download
    const anchor = document.createElement("a");
    anchor.href = key;
    anchor.download = key.substring(key.lastIndexOf("/") + 1);
    anchor.click();
  };
  return (
    <div className={classes.DocumentsForm}>
      {invoices.map((invoice) => (
        <div className={classes.InvoiceRow} key={invoice.id}>
          <div className={classes.SerialContainer}>
            <span className={classes.SerialText}>Transport name: </span>
            <span className={classes.SerialValue}>
              {transport?.registrationNumber}
            </span>
          </div>
          <div className={classes.InvoiceItem}>
            <div className={classes.TitleContainer}>
              <span className={classes.DocumentIcon}>{invoiceIcon}</span>
              <a
                style={{ textDecoration: "none" }}
                href={invoice.key}
                className={`${invoice.key ? classes.Hover : classes.NotHover} ${
                  classes.InvoiceTitle
                }`}
              >
                {invoice.documentName === null ? "Order" : invoice.documentName}
              </a>
            </div>
            <span className={classes.Line}></span>
            <div className={classes.SerialContainer}>
              <span className={classes.SerialText}>Serial number</span>
              <span className={classes.SerialValue}>{invoice.number}</span>
            </div>
            <span className={classes.Line}></span>
            <div className={classes.TimeContainer}>
              <span className={classes.TimeText}>Expires on</span>
              <span className={classes.TimeValue}>
                {dayjs(invoice.expireOn).format("DD/MM/YYYY")}
              </span>
            </div>
            <span className={classes.Line}></span>
            <button
              className={classes.Download}
              onClick={() => handleDownload(invoice.key)}
            >
              {downloadIcon}
            </button>
          </div>
        </div>
      ))}
      {addedDocuments.map((document) => (
        <Document
          key={document.id}
          documentName={document?.documentName} // Pass the actual document properties as props
          serialNumber={document.number}
          expireOn={document.expireOn}
          updateInvoices={updateInvoices}
          deleteAddedDocument={handleDeleteAddedDocument}
          setDocsLength={props.setDocsLength}
          transportId={props.transportId}
          transportArray={props.transportArray}
          doscLength={props.docLength}
        />
      ))}
      <div className={classes.AddNewFile}>
        <span className={classes.UploadText}>
          You can upload JPG, PNG, DOCX or PDF, 5 MB max size
        </span>
        <button className={classes.AddButton} onClick={handleAddNewDocuments}>
          <span className={classes.PlusIcon}>{plusIcon}</span>
          <span className={classes.AddText}>Add new file</span>
        </button>
      </div>
    </div>
  );
};
export default Documents;
