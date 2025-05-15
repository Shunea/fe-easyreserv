import { useEffect, useState } from "react";
import { getAllStaffForDashboard, getUpcomingVacations, getAdminRestaurantData, getRestaurantById } from "../../auth/api/requests";
import storage from "../../utils/storage";
import { scanIcon } from "../../icons/icons";
import Spinner from "../Spinner";
import QRcode from "../Staff/components/QRcode";
import { Employee, Restaurant } from "../Staff/StaffTypes";
import classes from "./Dashboard.module.css";
import KeyIndicators from "./KeyIndicators";
import StaffList from "./StaffList";
import Stock from "./Stock";
import Vacations from "./Vacations";
import { NotificationButton } from "../Statistics/Header";
import CalendarEmployeeDetails from "../Staff/OverviewCalendar/CalendarEmployeeDetails";
import TimeTable from "../Staff/OverviewCalendar/TimeTable";
type Props = {};
const Dashboard = (props: Props) => {
  const [qrButton, setQrButton] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacations, setVacations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const isAdmin = storage.getRole() === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const EmployeeResponse = await getAllStaffForDashboard();
        if (Array.isArray(EmployeeResponse)) {
          setEmployees(EmployeeResponse);
        } else {
          console.error(
            "getAllStaff did not return an array:",
            EmployeeResponse
          );
        }

        const vacationsResponse = await getUpcomingVacations();
        if (Array.isArray(vacationsResponse)) {
          setVacations(vacationsResponse);
        }

        if (isAdmin) {
          const adminData = await getAdminRestaurantData();
          if (adminData) {
            const restaurantData = await getRestaurantById(adminData.restaurantId);
            if (restaurantData) {
              setSelectedRestaurant(restaurantData);
            }
          }
        } else {
          const storedRestaurant = JSON.parse(
            localStorage.getItem("selectedRestaurant") ?? "null"
          );

          if (storedRestaurant) {
            setSelectedRestaurant(storedRestaurant);
          }
        }
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const [activeTab, setActiveTab] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  console.log(activeTab);

  return (
    <>
      {qrButton ? (
        <QRcode setQrButton={setQrButton} />
      ) : (
        <>
          <div className={classes.Head}>
            <div className={classes.Heading}>
              <div className={classes.CompanyTitle}>
                <label className={classes.CompanyName}>
                  {selectedRestaurant?.name}
                </label>
                <span className={classes.CompanyStatus}></span>
              </div>
              <div className={classes.CompanyAddress}>
                <label className={classes.CompanyAddressText}>
                  {selectedRestaurant?.address}
                </label>
              </div>
            </div>
            <div className={classes.HeadActions}>
              <button
                className={classes.ScanButton}
                onClick={() => setQrButton(true)}
              >
                <span className={classes.ScanIcon}>{scanIcon}</span>
                <span className={classes.ScanText}>Scan worker</span>
              </button>

              <NotificationButton />
            </div>
          </div>
          <div className={classes.DashboardContainer}>
            <KeyIndicators />
            <StaffList
              employees={employees}
              setActiveTab={setActiveTab}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
            <div className={classes.StockAndVacation}>
              <Stock />
              <Vacations employees={vacations} />
            </div>
          </div>
          {activeTab !== "" ? (
            <div className={classes.DashboardModal}>
              {activeTab === "details" ? (
                <CalendarEmployeeDetails
                  employee={selectedEmployee}
                  onClose={() => setActiveTab("")}
                  onBack={() => setActiveTab("")}
                />
              ) : activeTab === "time" ? (
                <TimeTable
                  employee={selectedEmployee}
                  onClose={() => setActiveTab("")}
                  onBack={() => setActiveTab("")}
                />
              ) : null}
            </div>
          ) : null}
        </>
      )}
      <Spinner loading={loading} />
    </>
  );
};
export default Dashboard;
