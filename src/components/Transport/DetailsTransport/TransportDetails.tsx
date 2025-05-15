import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  updateTransport,
  getAllStaff,
  getTransportById,
  getDocuments,
} from "../../../auth/api/requests";
import {
  closeIcon,
  downloadIcon,
  editIcon,
  invoiceIcon,
  LeftArrow,
} from "../../../icons/icons";
import OutsideClickHandler from "../../Staff/components/OutsideClickHandler";
import Documents from "../DocumentsTransport/Documents";
import Document from "../DocumentsTransport/Document";
import classes from "./TransportDetails.module.css";
import { Employee } from "src/components/Staff/StaffTypes";
import EditTransport from "../EditTransport/EditTransport";

type Props = {
  onCloseSideBar: (transportId) => void;
  transportId: string;
  employees: Employee[];
};

export type Invoice = {
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
const TransportDetails = (props: Props) => {
  const BoxRef = useRef<HTMLDivElement | null>(null);
  const [transport, setTransport] = useState<Transport>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransportById(props.transportId);
        setTransport(response);
        setDocsLength(response.document.length);
      } catch (error) {
        console.error("Can't get transport:", error);
      }
    };
    fetchData();
  }, [props.transportId]);

  const succes = () =>
    toast.success("Deleted!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleEditTransport = async () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [documents, setDocuments] = useState<Invoice[]>([]);
  const handleDownload = (key: string) => {
    // Function to initiate download
    const anchor = document.createElement("a");
    anchor.href = key;
    anchor.download = key.substring(key.lastIndexOf("/") + 1);
    anchor.click();
  };
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await getDocuments();
        // Filter documents based on props.transportId
        const filteredDocuments = fetchedDocuments.data.filter(
          (document) => document.itemId === props.transportId
        );
        setDocuments(filteredDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, [props.transportId]);
  const [activeTab, setActiveTab] = useState("details");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [docsLength, setDocsLength] = useState(0);
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  return (
    <>
      <div className={classes.Modal}>
        <div className={classes.Box} ref={BoxRef}>
          {/* <OutsideClickHandler
            innerRef={BoxRef}
            onClose={props.onCloseSideBar}
          /> */}
          <div className={classes.BoxHead}>
            <p className={classes.BoxHeadTitle}>
              Transport details · {transport?.registrationNumber}
            </p>
            <div className={classes.BoxHeadButtonContainer}>
              <button
                className={classes.BoxHeadButton}
                onClick={props.onCloseSideBar}
              >
                {closeIcon}
              </button>
            </div>
          </div>
          {/* <div className={classes.BoxList}>
            <div
              className={`${classes.BoxListItem} ${
                activeTab === "details" ? classes.ActiveTab : ""
              }`}
              onClick={() => handleTabClick("details")}
            >
              <p className={classes.BoxListItemText}>Details</p>
            </div>
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
          </div> */}
          {activeTab === "details" ? (
            <div className={classes.BoxBody}>
              <div className={classes.BoxContent}>
                <section className={classes.ContentSection}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>General</label>
                  </div>
                  <div className={classes.List}>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Transport ID</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {transport?.registrationNumber}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Type</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {transport?.type}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Seats</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {transport?.seats}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Mileage</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {transport?.mileage} km
                      </span>
                    </div>
                  </div>
                </section>
                <section className={classes.ContentSection}>
                  <label className={classes.SectionTitleText}>Drivers</label>
                  <div className={classes.SupplierListContainer}>
                    <div className={classes.SupplierList}>
                      {transport?.users.length !== 0 ? (
                        transport?.users.map((user, index) => {
                          const employee = props.employees.find(
                            (emp) => emp.id === user.id
                          );
                          if (employee) {
                            return (
                              <div
                                className={classes.SupplierRow}
                                key={user.id}
                              >
                                <div className={classes.SupplierNameContainer}>
                                  <img
                                    src={
                                      employee?.avatar?.startsWith("avatar_")
                                        ? require(`../../../assets/${employee?.avatar}`)
                                            .default
                                        : employee?.avatar !== null &&
                                          !employee?.avatar?.startsWith(
                                            "avatar_"
                                          )
                                        ? employee?.avatarUrl
                                        : DEFAULT_IMAGE
                                    }
                                    alt={user.username}
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      marginRight: "8px",
                                    }}
                                  />

                                  <div
                                    className={classes.SupplierNameBox}
                                    key={user.id}
                                  >
                                    <label className={classes.SupplierName}>
                                      {user.username}
                                      {index !== transport.users.length - 1 &&
                                        ""}
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={`${classes.SupplierNameBox} ${classes.Liscence}`}
                                  key={user.id}
                                >
                                  <label className={classes.SupplierName}>
                                    <span>Liscence</span>
                                    <span>№</span> A24689753
                                  </label>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                className={classes.SupplierNameBox}
                                style={{ padding: "16px" }}
                              >
                                <label className={classes.SupplierName}>
                                  No Drivers
                                </label>
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div
                          className={classes.SupplierNameBox}
                          style={{ padding: "16px" }}
                        >
                          <label className={classes.SupplierName}>
                            No Drivers
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                <section className={classes.ContentSection}>
                  <label className={classes.SectionTitleText}>Documents</label>
                  <div className={classes.DocumentContainer}>
                    {documents.map((invoice) => (
                      <div className={classes.InvoiceRow} key={invoice.id}>
                        <div className={classes.InvoiceItem}>
                          <div className={classes.TitleContainer}>
                            <span className={classes.DocumentIcon}>
                              {invoiceIcon}
                            </span>
                            <a
                              style={{ textDecoration: "none" }}
                              href={invoice.key}
                              className={`${
                                invoice.key ? classes.Hover : classes.NotHover
                              } ${classes.InvoiceTitle}`}
                            >
                              {invoice.documentName === null
                                ? "Order"
                                : invoice.documentName}
                            </a>
                          </div>
                          <div className={classes.SerialContainer}>
                            <span className={classes.SerialValue}>
                              <span>№</span>
                              {invoice.number}
                            </span>
                          </div>
                          <div className={classes.TimeContainer}>
                            <span className={classes.TimeText}>Expire on</span>
                            <span className={classes.TimeValue}>
                              {dayjs(invoice.expireOn).format("DD/MM/YYYY")}
                            </span>
                          </div>
                          <button
                            className={classes.Download}
                            onClick={() => handleDownload(invoice.key)}
                          >
                            {downloadIcon}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <button
                  className={classes.EditButton}
                  onClick={handleEditTransport}
                >
                  <span>{editIcon}</span>
                  <span className={classes.EditText}>Edit Transport</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={classes.BoxForm}>
              <Documents
                setDocsLength={setDocsLength}
                transportId={props.transportId}
                documents={documents}
                docLength={docsLength}
                transportArray={[]}
              />
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <EditTransport
          handleClose={handleCloseModal}
          transportId={props.transportId}
          transportArray={[]}
        />
      )}
    </>
  );
};
export default TransportDetails;
