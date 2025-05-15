import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteStock, getStockWithSupplier } from "../../auth/api/requests";
import { closeIcon, LeftArrow } from "../../icons/icons";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import Documents from "./Documents";
import classes from "./StockDetails.module.css";

type Props = {
  onCloseSideBar: (stokId) => void;
  stockId: string;
};

type Invoice = {
  id: string;
  documentName: string;
  key: string;
  number: string;
  issuedOn: string;
};

type Stock = {
  stockName: string;
  category: string;
  expirationDate: string;
  volume: number;
  reorderLimit: number;
  unit: string;
  tvaType: number;
  priceWithoutTva: number;
  priceWithTva: number;
  supplierName: string;
  idno: string;
  vat: string;
  iban: string;
  bankName: string;
  email: string;
  phoneNumber: string;
  invoiceNumber: string;
  document: Invoice[];
};
const StockDetails = (props: Props) => {
  const BoxRef = useRef<HTMLDivElement | null>(null);
  const [stock, setStock] = useState<Stock>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStockWithSupplier(props.stockId);
        setStock(response);
        setDocsLength(response.document.length);
      } catch (error) {
        console.error("Can't get stock:", error);
      }
    };
    fetchData();
  }, [props.stockId]);

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

  const handleDeleteStock = async () => {
    try {
      await deleteStock(props.stockId);
      props.onCloseSideBar(props.stockId);
      succes();
    } catch (error) {
      console.error("Cant't delete stock:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("details");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [docsLength, setDocsLength] = useState(0);

  return (
    <>
      <div className={classes.Modal}>
        <div className={classes.Box} ref={BoxRef}>
          <OutsideClickHandler
            innerRef={BoxRef}
            onClose={props.onCloseSideBar}
          />

          <div className={classes.BoxHead}>
            <p className={classes.BoxHeadTitle}>
              Item details · {stock?.stockName}
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
          <div className={classes.BoxList}>
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
          </div>
          {activeTab === "details" ? (
            <div className={classes.BoxBody}>
              <div className={classes.BoxContent}>
                <section className={classes.ContentSection}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>General</label>
                  </div>
                  <div className={classes.List}>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Title</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.stockName}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Category</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock &&
                          stock?.category.charAt(0).toUpperCase() +
                            stock?.category
                              .replace(/_/g, " ")
                              .slice(1)
                              .toLowerCase()}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label
                        className={classes.RowTitle}
                        style={{ minWidth: "101px" }}
                      >
                        Expiration date
                      </label>
                      <span className={classes.Line}></span>
                      <span
                        className={classes.RowValue}
                        style={{ minWidth: "112px" }}
                      >
                        {stock &&
                          dayjs(stock.expirationDate).format("DD MMMM YYYY")}
                      </span>
                    </div>
                  </div>
                </section>
                <section className={classes.ContentSection}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>Stock</label>
                  </div>
                  <div className={classes.List}>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Volume</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.volume} {stock?.unit}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Reorder limit</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.reorderLimit} {stock?.unit}
                      </span>
                    </div>
                  </div>
                </section>
                <section className={classes.ContentSection}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>Pricing</label>
                  </div>
                  <div className={classes.List}>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>TVA type</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.tvaType}%
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>
                        Price (without TVA)
                      </label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.priceWithoutTva} lei
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>
                        Price (with TVA)
                      </label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.priceWithTva} lei
                      </span>
                    </div>
                  </div>
                </section>
                <section className={classes.ContentSection}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>Supplier</label>
                  </div>
                  <div className={classes.List}>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Supplier</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.supplierName}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>IDNO</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>{stock?.idno}</span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>
                        VAT identification number
                      </label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>{stock?.vat}</span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>IBAN code</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>{stock?.iban}</span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Bank name</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.bankName}
                      </span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>E-mail address</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>{stock?.email}</span>
                    </div>
                    <div className={classes.Row}>
                      <label className={classes.RowTitle}>Phone number</label>
                      <span className={classes.Line}></span>
                      <span className={classes.RowValue}>
                        {stock?.phoneNumber}
                      </span>
                    </div>
                  </div>
                </section>
                <section className={classes.ContentSection}>
                  <div className={classes.SectionTitle}>
                    <label className={classes.SectionTitleText}>
                      Documents
                    </label>
                  </div>
                </section>
                <button className={classes.DeleteButton}>
                  <span
                    className={classes.DeleteText}
                    onClick={handleDeleteStock}
                  >
                    Delete item
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className={classes.BoxForm}>
              <Documents
                setDocsLength={setDocsLength}
                invoiceNr={stock?.invoiceNumber}
                stockId={props.stockId}
                documents={stock?.document}
                docLength={docsLength}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default StockDetails;
