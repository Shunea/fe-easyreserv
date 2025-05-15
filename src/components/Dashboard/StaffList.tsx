import { useRef, useState } from "react";
import {
  dotIcon,
  FloorIcon,
  helpIcon,
  humansIcon,
  spreadIcon,
  StaffListScanIcon,
} from "../../icons/icons";
import OutsideClickHandler from "../Staff/components/OutsideClickHandler";
import QRcode from "../Staff/components/QRcode";
import SpaceChange from "../Staff/components/SpaceChange";
import { Employee } from "../Staff/StaffTypes";
import classes from "./StaffList.module.css";
import { useNavigate } from "react-router-dom";

type Props = {
  employees: Employee[];
  setActiveTab: (value) => void;
  selectedEmployee: any;
  setSelectedEmployee: (employee: any) => void;
};

const getEmployeeStatus = (employee: Employee) => {
  if (!employee.staffSchedules || employee.staffSchedules.length === 0) {
    return {
      isLoggedIn: false,
      floor: null as string | null,
      checkStatus: 0,
      checkinTime: null as string | null,
      checkoutTime: null as string | null
    };
  }

  // Sort schedules by checkin time (newest first)
  const sortedSchedules = [...employee.staffSchedules].sort((a, b) => {
    const dateA = new Date(a.checkinTime || 0);
    const dateB = new Date(b.checkinTime || 0);
    return dateB.getTime() - dateA.getTime();
  });

  const lastSchedule = sortedSchedules[0];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const status = {
    isLoggedIn: false,
    floor: null as string | null,
    checkStatus: 0,
    checkinTime: null as string | null,
    checkoutTime: null as string | null
  };

  if (lastSchedule) {
    const checkinTime = lastSchedule.checkinTime ? new Date(lastSchedule.checkinTime) : null;
    const checkoutTime = lastSchedule.checkoutTime ? new Date(lastSchedule.checkoutTime) : null;
    
    // Для активных смен (checkStatus === 1)
    if (lastSchedule.checkStatus === 1 && checkinTime) {
      const checkinDate = new Date(checkinTime.getFullYear(), checkinTime.getMonth(), checkinTime.getDate());
      
      // Если смена начата сегодня или вчера - статус "Working"
      if (checkinDate.getTime() === today.getTime() || 
          checkinDate.getTime() === today.getTime() - 86400000) {
        status.isLoggedIn = true;
        status.floor = lastSchedule.floor;
        status.checkStatus = 1;
        status.checkinTime = lastSchedule.checkinTime || null;
      } else {
        status.floor = "Pending...";
        status.checkStatus = 0;
      }
    } 
    // Для завершенных смен (checkStatus === 2)
    else if (lastSchedule.checkStatus === 2 && checkoutTime) {
      const checkoutDate = new Date(checkoutTime.getFullYear(), checkoutTime.getMonth(), checkoutTime.getDate());
      
      if (checkoutDate.getTime() === today.getTime()) {
        status.floor = "Worked";
        status.checkStatus = 2;
        status.checkinTime = lastSchedule.checkinTime || null;
        status.checkoutTime = lastSchedule.checkoutTime || null;

        // Используем дату checkout для определения даты pending
        const checkoutDateTime = lastSchedule.checkoutTime ? new Date(lastSchedule.checkoutTime) : new Date();
        const pendingDate = new Date(Date.UTC(
          checkoutDateTime.getUTCFullYear(),
          checkoutDateTime.getUTCMonth(),
          checkoutDateTime.getUTCDate() + 1,
          0, 0, 0
        ));
      } else {
        status.floor = "Pending...";
        status.checkStatus = 0;
      }
    } else {
      status.floor = "Pending...";
      status.checkStatus = 0;
    }
  }

  return status;
};

const formatTime = (timeString: string | undefined) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
  });
};

const StaffList = ({
  employees,
  setActiveTab,
  selectedEmployee,
  setSelectedEmployee,
}: Props) => {
  const [selectedStaffType, setSelectedStaffType] = useState<string>("All Staff");

  const navigate = useNavigate();
  const handleViewStaffClick = () => {
    navigate("/staff");
  };

  const staffTypes = ["All Staff", "Check In Staff", "Check Out Staff", "Pending Staff"];

  const handleStaffTypeChange = (newType: string) => {
    setSelectedStaffType(newType);
  };

  const filteredEmployees = employees.filter((employee) => {
    const status = getEmployeeStatus(employee);

    switch (selectedStaffType) {
      case "All Staff":
        return true;
      case "Check In Staff":
        return status.checkStatus === 1;
      case "Check Out Staff":
        return status.checkStatus === 2;
      case "Pending Staff":
        return status.checkStatus === 0;
      default:
        return false;
    }
  });

  const loggedInEmployees = filteredEmployees.filter(employee => 
    employee.staffSchedules?.some(schedule => 
      new Date(schedule.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    )
  );

  const DEFAULT_IMAGE = "/staffImages/barmen.png";
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const handleToggleSpreadButton = (
    employee: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // Prevent the event from propagating to the outer container

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const modalWidth = 100;

    setModalPosition({
      top: buttonRect.top + buttonRect.height + 10, // 10px below the button's center
      left: buttonRect.right - modalWidth, // Right upper corner of the button
    });

    setSelectedEmployee(employee);
    setTabOpen(true);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [qrButton, setQrButton] = useState(false);
  const employeeActionsRef = useRef<HTMLDivElement | null>(null);
  const [tabOpen, setTabOpen] = useState(false);

  return (
    <>
      {qrButton ? (
        <QRcode setQrButton={setQrButton} />
      ) : (
        <div className={classes.StaffList}>
          <div className={classes.Head}>
            <div className={classes.HeadTitle}>
              <span className={classes.HeadTitleText}>Working staff</span>
              <span className={classes.HeadTitleValue}>
                active {loggedInEmployees.length} / {filteredEmployees.length} workers
              </span>
            </div>
            <div className={classes.HeadActions}>
              <SpaceChange
                space={selectedStaffType}
                onSpaceChange={handleStaffTypeChange}
                spaces={staffTypes}
              />
            </div>
          </div>
          <div className={classes.Content}>
            <div className={classes.List}>
              {filteredEmployees.map((employee) => {
                const status = getEmployeeStatus(employee);
                
                return (
                  <div
                    key={employee.id}
                    className={`${classes.EmployeeRow} ${
                      status.isLoggedIn ? classes.Checked : classes.NotChecked
                    }`}
                  >
                    <div
                      className={`${classes.EmployeeNameContainer} ${
                        status.isLoggedIn ? classes.LoggedIn : classes.NotLoggedIn
                      }`}
                    >
                      <div className={classes.EmployeeAvatarContainer}>
                        <img
                          className={classes.EmployeeAvatar}
                          src={
                            employee.avatar?.startsWith("avatar_")
                              ? require(`../../assets/${employee?.avatar}`).default
                              : employee?.avatar !== null &&
                                !employee?.avatar?.startsWith("avatar_")
                              ? employee?.avatarUrl
                              : DEFAULT_IMAGE
                          }
                        />
                        <span
                          className={`${classes.WorkDot} ${
                            status.isLoggedIn ? classes.GreenDot : classes.RedDot
                          }`}
                        >
                          {dotIcon}
                        </span>
                      </div>
                      <div className={classes.EmployeeTitleContainer}>
                        <p className={classes.EmployeeName}>
                          {employee.username}
                          {status.checkStatus === 1 && status.checkinTime && (
                            <span className={classes.CheckInTime}>
                              {` (${formatTime(status.checkinTime)})`}
                            </span>
                          )}
                          {status.checkStatus === 2 && status.checkoutTime && (
                            <span className={classes.CheckInTime}>
                              {` (${formatTime(status.checkoutTime)})`}
                            </span>
                          )}
                        </p>
                        <div className={classes.EmployeeSpace}>
                          <span className={classes.EmployeeSpaceIcon}>
                            {status.checkStatus === 1 ? FloorIcon :
                             status.checkStatus === 2 ? FloorIcon : helpIcon}
                          </span>
                          <span className={classes.EmployeeSpaceName}>
                            {status.checkStatus === 1 ? status.floor :
                             status.checkStatus === 2 ? "Worked" : "Pending..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      ref={employeeActionsRef}
                      className={classes.EmployeeActionsContainer}
                    >
                      <OutsideClickHandler
                        innerRef={employeeActionsRef}
                        onClose={() => setTabOpen(false)}
                      />
                      {(status.checkStatus === 0 || 
                        status.checkStatus === 1 ||
                        status.checkStatus === 2) && (
                        <button
                          className={classes.ScanButton}
                          onClick={() => setQrButton(true)}
                        >
                          <span>{StaffListScanIcon}</span>
                        </button>
                      )}
                      <button
                        className={classes.EmployeeActionButton}
                        onClick={(e) => handleToggleSpreadButton(employee, e)}
                      >
                        <span className={classes.EmployeeActionIcon}>
                          {spreadIcon}
                        </span>
                      </button>
                      {selectedEmployee && tabOpen && (
                        <div
                          className={classes.ButtonModal}
                          style={{
                            position: "fixed",
                            top: modalPosition.top + "px",
                            left: modalPosition.left + "px",
                            zIndex: 999,
                          }}
                          onMouseLeave={() => setTabOpen(false)}
                        >
                          <button
                            className={classes.ModalButton}
                            onClick={() => handleTabClick("details")}
                          >
                            Details
                          </button>
                          <button
                            className={classes.ModalButton}
                            onClick={() => handleTabClick("time")}
                          >
                            TimeTable
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            className={classes.ViewStaffButton}
            onClick={handleViewStaffClick}
          >
            <span className={classes.ButtonIcon}>{humansIcon}</span>
            <span className={classes.ButtonText}>View all staff</span>
          </button>
        </div>
      )}
    </>
  );
};
export default StaffList;
