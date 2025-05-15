import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getDocuments } from "../../auth/api/requests";
import { downloadIcon, invoiceIcon, plusIcon } from "../../icons/icons";
import Document from "./Document";
import classes from "./Documents.module.css";

type Props = {
  setDocsLength: (length) => void;
  invoiceNr: string | undefined;
  stockId: string;
  documents: Invoice[] | undefined;
  docLength: number
};
type Invoice = {
  id: string;
  documentName: string;
  key: string;
  number: string;
  issuedOn: string;
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
      type: "invoice",
      documentName: "",
      number: "",
      issuedOn: "",
      key: "",
    };
    setAddedDocuments([...addedDocuments, newDocument]);
  };

  // const handleDeleteAddedDocument = () => {
  //   setAddedDocuments((prevDocuments) =>
  //     prevDocuments.filter((document) => document.number !== "")
  //   );
  // };

  const handleDeleteAddedDocument = () => {
    setAddedDocuments((prevDocuments) => {
      return prevDocuments.filter((document) => document.number !== "");
    });
  };

  return (
    <div className={classes.DocumentsForm}>
      {invoices.map((invoice) => (
        <div className={classes.InvoiceRow} key={invoice.id}>
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
              <span className={classes.TimeText}>Issued on</span>
              <span className={classes.TimeValue}>
                {dayjs(invoice.issuedOn).format("DD/MM/YYYY")}
              </span>
            </div>
            <span className={classes.Line}></span>
            <button className={classes.Download}>{downloadIcon}</button>
          </div>
        </div>
      ))}
      {addedDocuments.map((document) => (
        <Document
          key={document.id}
          documentName={document?.documentName} // Pass the actual document properties as props
          serialNumber={document.number}
          issuedOn={document.issuedOn}
          updateInvoices={updateInvoices}
          deleteAddedDocument={handleDeleteAddedDocument}
          setDocsLength={props.setDocsLength}
          stockId={props.stockId}
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
