import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import {
  closeIcon,
  documentIcon,
  editIcon,
  FloorIcon,
  leftArrowIcon,
  notificationIcon,
  uploadIcon,
  VacationCalendarIcon,
} from "../../../icons/icons";
import OutsideClickHandler from "../components/OutsideClickHandler";
import { Employee } from "../StaffTypes";
import classes from "./CalendarEmployeeDetails.module.css";
import TimeTable from "./TimeTable";
import EditEmployeeDetails from "../EditEmployee/DetailsTab/EditEmployeeDetails";
import EditEmployee from "../EditEmployee/EditEmployee";

type Props = {
  employee: Employee;
  onBack: (tab: string) => void;
  onClose: () => void;
};
const CalendarEmployeeDetails = ({ employee, onBack, onClose }: Props) => {
  // Initialize variables to keep track of counts
  let consecutiveWorkingDays = 0;
  let consecutiveHolidayDays = 0;
  let maxConsecutiveWorkingDays = 0;
  let maxConsecutiveHolidayDays = 0;
  console.log(employee);

  // Calculating of the schedule (WORKING and HOLIDAY)
  if (employee && employee.staffSchedules) {
    for (const schedule of employee.staffSchedules) {
      if (schedule.status === "WORKING") {
        consecutiveWorkingDays++;
        if (consecutiveHolidayDays > maxConsecutiveHolidayDays) {
          maxConsecutiveHolidayDays = consecutiveHolidayDays;
        }
        consecutiveHolidayDays = 0;
      } else if (schedule.status === "HOLIDAY") {
        consecutiveHolidayDays++;
        if (consecutiveWorkingDays > maxConsecutiveWorkingDays) {
          maxConsecutiveWorkingDays = consecutiveWorkingDays;
        }
        consecutiveWorkingDays = 0;
      }
    }
  }

  let minDate = employee?.staffSchedules?.[0]?.date;

  function getUniqueTourInfo(tours) {
    const uniqueInfo = new Set();
    return tours.reduce((result, tour) => {
      const tourInfo = `${tour.title}-${tour.floor}-${tour.startTime}-${tour.endTime}`;
      if (!uniqueInfo.has(tourInfo)) {
        uniqueInfo.add(tourInfo);
        result.push({
          title: tour.title,
          floor: tour.floor,
          startTime: tour.startTime,
          endTime: tour.endTime,
        });
      }
      return result;
    }, []);
  }

  const sortedTourInfo = getUniqueTourInfo(employee.staffSchedules).sort(
    (a, b) => {
      // You can customize the sorting logic here if needed
      return a.title.localeCompare(b.title);
    }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditEmployee = async () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [showTimeTable, setShowTimeTable] = useState(false);
  const employeeBoxRef = useRef<HTMLDivElement | null>(null);
  const [employeee, setEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newFetch, setNewFetch] = useState(false);

  const updateEmployeeData = (updatedEmployee: Employee) => {
    setEmployee((employee) =>
      employee?.id === updatedEmployee.id ? updatedEmployee : employee
    );
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  };
  return showTimeTable ? (
    <TimeTable onBack={onBack} onClose={onClose} employee={employee} />
  ) : (
    <>
      <div className={classes.CalendarBox} ref={employeeBoxRef}>
        <OutsideClickHandler innerRef={employeeBoxRef} onClose={onClose} />
        <div className={classes.CalendarHead}>
          <div className={classes.HeadTitle}>
            <button className={classes.BackButton} onClick={() => onBack("")}>
              {leftArrowIcon}
            </button>
            <span className={classes.EmployeeName}>Employee details</span>
            <span className={classes.EmployeeNamePoint}>·</span>
            <span className={classes.EmployeeName}>{employee.username}</span>
          </div>
          <button className={classes.HeadClose} onClick={() => onClose()}>
            {closeIcon}
          </button>
        </div>
        <div className={classes.CalendarBody}>
          <div className={classes.Content}>
            <div className={classes.GeneralSection}>
              <div className={classes.SectionTitle}>
                <label className={classes.SectionTitleText}>General</label>
              </div>
              <div className={classes.GeneralSectionList}>
                <div className={classes.GeneralSectionRow}>
                  <label
                    className={classes.GeneralRowLabel}
                    style={{ opacity: 0.35 }}
                  >
                    Full name
                  </label>
                  <div className={classes.RowLine}>
                    <span className={classes.NameLine}></span>
                  </div>
                  <label className={classes.GeneralRowLabel}>
                    {employee.username}
                  </label>
                </div>

                <div className={classes.GeneralSectionRow}>
                  <label
                    className={classes.GeneralRowLabel}
                    style={{ opacity: 0.35 }}
                  >
                    Department
                  </label>
                  <div className={classes.RowLine}>
                    <span className={classes.NameLine}></span>
                  </div>
                  <label className={classes.GeneralRowLabel}>
                    {employee.department}
                  </label>
                </div>

                <div className={classes.GeneralSectionRow}>
                  <label
                    className={classes.GeneralRowLabel}
                    style={{ opacity: 0.35 }}
                  >
                    Role
                  </label>
                  <div className={classes.RowLine}>
                    <span className={classes.NameLine}></span>
                  </div>
                  <label className={classes.GeneralRowLabel}>
                    {employee.role.charAt(0).toUpperCase() +
                      employee.role.slice(1).toLowerCase()}
                  </label>
                </div>
                <div className={classes.GeneralSectionRow}>
                  <label
                    className={classes.GeneralRowLabel}
                    style={{ opacity: 0.35 }}
                  >
                    Salary
                  </label>
                  <div className={classes.RowLine}>
                    <span className={classes.NameLine}></span>
                  </div>
                  <label className={classes.GeneralRowLabel}>
                    {employee.salary?.toLocaleString()} lei
                  </label>
                </div>
                <div className={classes.GeneralSectionRow}>
                  <label
                    className={classes.GeneralRowLabel}
                    style={{ opacity: 0.35 }}
                  >
                    E-mail adress
                  </label>
                  <div className={classes.RowLine}>
                    <span className={classes.NameLine}></span>
                  </div>
                  <label className={classes.GeneralRowLabel}>
                    {employee.email}
                  </label>
                </div>
                <div className={classes.GeneralSectionRow}>
                  <label
                    className={classes.GeneralRowLabel}
                    style={{ opacity: 0.35 }}
                  >
                    Phone Number
                  </label>
                  <div className={classes.RowLine}>
                    <span className={classes.NameLine}></span>
                  </div>
                  <label className={classes.GeneralRowLabel}>
                    {`+${employee.phoneNumber.slice(
                      0,
                      3
                    )} ${employee.phoneNumber.slice(
                      3,
                      5
                    )} ${employee.phoneNumber.slice(5, 8)} 
                  ${employee.phoneNumber.slice(8)}`}
                  </label>
                </div>
              </div>
            </div>
            <div className={classes.ScheduleSection}>
              <div className={classes.SectionTitle}>
                <label className={classes.SectionTitleText}>
                  Working Schedule
                </label>
              </div>
              <div className={classes.GeneralSectionRow}>
                <label
                  className={classes.GeneralRowLabel}
                  style={{ opacity: 0.35 }}
                >
                  Working Days
                </label>
                <div className={classes.RowLine}>
                  <span className={classes.NameLine}></span>
                </div>
                <label className={classes.GeneralRowLabel}>
                  {maxConsecutiveWorkingDays}
                </label>
              </div>
              <div className={classes.GeneralSectionRow}>
                <label
                  className={classes.GeneralRowLabel}
                  style={{ opacity: 0.35 }}
                >
                  Resting days
                </label>
                <div className={classes.RowLine}>
                  <span className={classes.NameLine}></span>
                </div>
                <label className={classes.GeneralRowLabel}>
                  {maxConsecutiveHolidayDays}
                </label>
              </div>
              <div className={classes.GeneralSectionRow}>
                <label
                  className={classes.GeneralRowLabel}
                  style={{ opacity: 0.35 }}
                >
                  Starting Date
                </label>
                <div className={classes.RowLine}>
                  <span className={classes.NameLine}></span>
                </div>
                <label className={classes.GeneralRowLabel}>
                  {dayjs(minDate).format("DD MMMM YYYY")}
                </label>
              </div>
              <button
                className={classes.TimeTable}
                onClick={() => setShowTimeTable(true)}
              >
                <span className={classes.CalendarIcon}>
                  {VacationCalendarIcon}
                </span>
                <span className={classes.TimeTableText}>
                  View the timetable
                </span>
              </button>
            </div>
            <div className={classes.ToursSection}>
              <div className={classes.SectionTitle}>
                <label className={classes.SectionTitleText}>
                  Working tours
                </label>
              </div>
              <div className={classes.ToursList}>
                {sortedTourInfo.map((tour) => (
                  <div className={classes.ToursItem}>
                    <div className={classes.TourTitle}>
                      <span
                        className={classes.TourColor}
                        style={{ background: "green" }}
                      ></span>
                      <span className={classes.TourTitleText}>
                        {tour.title}
                      </span>
                    </div>
                    <div className={classes.TourSpace}>
                      <span className={classes.SpaceIcon}>{FloorIcon}</span>
                      <span className={classes.SpaceText}>{tour.floor}</span>
                    </div>
                    <div className={classes.TourTime}>
                      <span className={classes.TourTimeText}>
                        {tour.startTime} - {tour.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={classes.VacationSection}>
              <div className={classes.SectionTitle}>
                <label className={classes.SectionTitleText}>
                  Scheduled vacations
                </label>
              </div>
              <div className={classes.VacationsList}>
                {employee.vacations &&
                  employee.vacations
                    .filter(
                      (vacation) =>
                        vacation.startDate && vacation.endDate !== null
                    )
                    .sort((a, b) => {
                      const startDateA = new Date(a.startDate).getTime();
                      const startDateB = new Date(b.startDate).getTime();
                      if (isNaN(startDateA)) return 1; // Handle invalid dates
                      if (isNaN(startDateB)) return -1; // Handle invalid dates
                      if (startDateA > startDateB) return -1;
                      if (startDateA < startDateB) return 1;
                      return 0;
                    })
                    .map((vacation) => (
                      <div className={classes.VacationItem}>
                        <div className={classes.VacationTitle}>
                          <span className={classes.VacationTitleText}>
                            Vacation{" "}
                            <span className={classes.VacationTitleIdentifier}>
                              {vacation.vacationIdentifier}
                            </span>
                          </span>
                        </div>
                        <div className={classes.VacationTime}>
                          <span className={classes.VacationTimeText}>
                            {dayjs(vacation.startDate).format("DD MMMM YYYY")}
                            {vacation.endDate === vacation.startDate
                              ? null
                              : ` - ${dayjs(vacation.endDate).format(
                                  "DD MMMM YYYY"
                                )}`}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            <div className={classes.DocumentsSection}>
              <div className={classes.SectionTitle}>
                <label className={classes.SectionTitleText}>Documents</label>
              </div>
              <div className={classes.DocumentsList}>
                <div className={classes.StandartDocumentItem}>
                  <div className={classes.StandartDocumentTitle}>
                    <span className={classes.DocumentIcon}>{documentIcon}</span>
                    <span className={classes.DocumentTitle}>ID Card</span>
                  </div>
                  {employee.documents &&
                  employee.documents.find(
                    (document) => document.type === "ID card" && document.type
                  ) ? (
                    <>
                      <div className={classes.StandartDocumentNumber}>
                        <span className={classes.DocumentNumberN}>№</span>
                        <span className={classes.DocumentNumber}>
                          {
                            employee?.documents?.find(
                              (document) =>
                                document?.type === "ID card" && document?.number
                            )?.number
                          }
                        </span>
                      </div>
                      <div className={classes.StandartDocumentExpire}>
                        <span className={classes.DocumentExpireText}>
                          Expire on
                        </span>
                        <span className={classes.DocumentExpireDate}>
                          {dayjs(
                            employee?.documents?.find(
                              (document) =>
                                document?.type === "ID card" &&
                                document?.expireOn
                            )?.expireOn
                          ).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <button
                        className={classes.UploadButton}
                        onClick={() =>
                          window.open(
                            employee?.documents?.find(
                              (document) =>
                                document.type === "ID card" && document?.image
                            )?.image,
                            "_blank"
                          )
                        }
                      >
                        <span className={classes.UploadIcon}>{uploadIcon}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={classes.SafeSpace}></div>
                      <span className={classes.Missing}>Missing</span>

                      <button className={classes.UploadButton}>
                        <span className={classes.UploadIcon}>
                          {notificationIcon}
                        </span>
                      </button>
                    </>
                  )}
                </div>
                <div className={classes.StandartDocumentItem}>
                  <div className={classes.StandartDocumentTitle}>
                    <span className={classes.DocumentIcon}>{documentIcon}</span>
                    <span className={classes.DocumentTitle}>
                      Employment application
                    </span>
                  </div>
                  {employee?.documents?.find(
                    (document) => document.type === "Application for employment"
                  ) ? (
                    <>
                      <div className={classes.StandartDocumentNumber}>
                        <span className={classes.DocumentNumberN}>№</span>
                        <span className={classes.DocumentNumber}>
                          {
                            employee?.documents?.find(
                              (document) =>
                                document.type ===
                                  "Application for employment" &&
                                document.number
                            )?.number
                          }
                        </span>
                      </div>
                      <div className={classes.StandartDocumentExpire}>
                        <span className={classes.DocumentExpireText}>
                          Expire on
                        </span>
                        <span className={classes.DocumentExpireDate}>
                          {dayjs(
                            employee?.documents?.find(
                              (document) =>
                                document.type ===
                                  "Application for employment" &&
                                document.expireOn
                            )?.expireOn
                          ).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <button
                        className={classes.UploadButton}
                        onClick={() =>
                          window.open(
                            employee?.documents?.find(
                              (document) =>
                                document.type ===
                                  "Application for employment" && document.image
                            )?.image,
                            "_blank"
                          )
                        }
                      >
                        <span className={classes.UploadIcon}>{uploadIcon}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={classes.SafeSpace}></div>
                      <span className={classes.Missing}>Missing</span>

                      <button className={classes.UploadButton}>
                        <span className={classes.UploadIcon}>
                          {notificationIcon}
                        </span>
                      </button>
                    </>
                  )}
                </div>
                <div className={classes.MilitaryDocumentItem}>
                  <div className={classes.StandartDocumentTitle}>
                    <span className={classes.DocumentIcon}>{documentIcon}</span>
                    <span className={classes.DocumentTitle}>Military book</span>
                  </div>
                  {employee?.documents?.find(
                    (document) => document.type === "Military book"
                  ) ? (
                    <>
                      <div className={classes.StandartDocumentNumber}>
                        <span className={classes.DocumentNumberN}>№</span>
                        <span className={classes.DocumentNumber}>
                          {
                            employee?.documents?.find(
                              (document) =>
                                document.type === "Military book" &&
                                document.number
                            )?.number
                          }
                        </span>
                      </div>
                      <button
                        className={classes.UploadButton}
                        onClick={() =>
                          window.open(
                            employee?.documents?.find(
                              (document) =>
                                document.type === "Military book" &&
                                document.image
                            )?.image,
                            "_blank"
                          )
                        }
                      >
                        <span className={classes.UploadIcon}>{uploadIcon}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={classes.SafeSpace}></div>
                      <span className={classes.Missing}>Missing</span>

                      <button className={classes.UploadButton}>
                        <span className={classes.UploadIcon}>
                          {notificationIcon}
                        </span>
                      </button>
                    </>
                  )}
                </div>
                {employee?.vacations
                  ?.filter(
                    (vacation) =>
                      vacation.startDate && vacation.endDate !== null
                  )
                  .filter((vacation) => vacation.key !== null)
                  .sort((a, b) => {
                    const startDateA = new Date(a.startDate).getTime();
                    const startDateB = new Date(b.startDate).getTime();
                    if (isNaN(startDateA)) return 1; // Handle invalid dates
                    if (isNaN(startDateB)) return -1; // Handle invalid dates
                    if (startDateA > startDateB) return -1;
                    if (startDateA < startDateB) return 1;
                    return 0;
                  })
                  .map((vacation) => (
                    <div
                      className={classes.StandartDocumentItem}
                      key={vacation.id}
                    >
                      <div className={classes.StandartDocumentTitle}>
                        <span className={classes.DocumentIcon}>
                          {documentIcon}
                        </span>
                        <span className={classes.DocumentTitle}>
                          Vacation order
                        </span>
                      </div>
                      <div className={classes.StandartDocumentNumber}>
                        <span className={classes.DocumentNumberN}>№</span>
                        <span className={classes.DocumentNumber}>
                          {vacation.id.substring(0, 8)}
                        </span>
                      </div>
                      <div className={classes.StandartDocumentExpire}>
                        <span
                          className={classes.DocumentExpireText}
                          style={{ minWidth: "70px" }}
                        >
                          Expire on
                        </span>
                        <span className={classes.DocumentExpireDate}>
                          {dayjs(vacation.endDate).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <button
                        className={classes.UploadButton}
                        onClick={() => {
                          if (vacation.image) {
                            window.open(vacation.image, "_blank");
                          }
                        }}
                      >
                        <span className={classes.UploadIcon}>{uploadIcon}</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={classes.Actions}>
            <button className={classes.EditButton} onClick={handleEditEmployee}>
              <span className={classes.EditIcon}>{editIcon}</span>
              <span className={classes.EditButtonText}>Edit employee</span>
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <EditEmployee
          employee={employee}
          onCloseSidebar={handleCloseModal}
          setEmployee={updateEmployeeData}
          setNewFetch={setNewFetch}
        />
      )}
    </>
  );
};
export default CalendarEmployeeDetails;
