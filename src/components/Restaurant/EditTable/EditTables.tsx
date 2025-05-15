import React, { useEffect, useRef, useState } from "react";
import classes from "./EditTables.module.css";
import { closeIcon } from "../../../icons/icons";
import EditTablesDetails from "./DetailsTab/EditTableDetails";
import EditTablesWaiters from "./WaitersTab/EditTableWaiters";
import Reservations from "./ReservationsTab/Reservations";
import {
  getReservations,
  //  getTables
} from "src/auth/api/requests";
import OutsideClickHandler from "../../Staff/components/OutsideClickHandler";

// type Table = {
//   id: string;
//   username: string;
//   image?: string;
//   scheudle?: {
//     status: string;
//     floor: string;
//   }[];
//   email: string;
//   phone: string;
// };

type ReservationsData = {
  status: string;
};

type EditTablesPropsProps = {
  table: any;
  tables: any;
  placeType:string;
  onCloseSidebar: () => void;
  // setEmployee: (updatedEmployee: Employee) => void;
};

const EditTablesProps: React.FC<EditTablesPropsProps> = ({
  table,
  onCloseSidebar,
  placeType,
  // setTable,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [reservations, setReservations] = useState<ReservationsData[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservations(); // Pass the authToken to the getTables function
        setReservations(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error if needed
      }
    };

    fetchReservations();
  }, []); // Add authToken as a dependency to useEffect to re-fetch data when the token changes
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const tableBoxRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className={classes.EditEmployeeModal}>
        <div ref={tableBoxRef} className={classes.EditEmployeeBox}>
          <OutsideClickHandler
            innerRef={tableBoxRef}
            onClose={onCloseSidebar}
          />
          <div className={classes.BoxHead}>
            <p className={classes.BoxHeadTitle}>Edit table</p>
            <div className={classes.BoxHeadButtonContainer}>
              <button
                className={classes.BoxHeadButton}
                onClick={onCloseSidebar}
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
            {/* <div
                className={`${classes.BoxListItem} ${
                  activeTab === "waiters" ? classes.ActiveTab : ""
                }`}
                onClick={() => handleTabClick("waiters")}
              >
                <p className={classes.BoxListItemText}>
                    {tables.length === 0 ? (
                      <p>Loading data...</p>
                    ) : (
                      <>
                        <p style={{ marginTop: "10px" }}> Waiters </p>
                        <span style={{
                          marginTop: "10px",
                          color: "silver",
                          paddingLeft: "5px",
                        }}>·
                          {tables[0].waiters}
                        </span>
                      </>
                    )}
                  </p>
              </div> */}
            <div
              className={`${classes.BoxListItem} ${
                activeTab === "reservations" ? classes.ActiveTab : ""
              }`}
              onClick={() => handleTabClick("reservations")}
            >
              <p className={classes.BoxListItemText}>
                <>
                  <p> Reservations </p>
                  {reservations.length === 0 ? (
                    <span
                      style={{
                        color: "silver",
                        paddingLeft: "5px",
                      }}
                    >
                      · {reservations.length}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "silver",
                        paddingLeft: "10px",
                      }}
                    >
                      · {reservations.length}
                    </span>
                  )}
                </>
              </p>
            </div>
          </div>
          {activeTab === "details" && (
            <EditTablesDetails
              table={table}
              onCloseSidebar={onCloseSidebar}
              // setEmployee={setEmployee}
            />
          )}
          {activeTab === "waiters" && (
            <EditTablesWaiters table={table} onSearch={(query: string) => {}} />
          )}
          {activeTab === "reservations" && <Reservations table={table} />}
        </div>
      </div>
    </>
  );
};

export default EditTablesProps;
