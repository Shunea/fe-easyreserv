import React, { useRef, useState } from "react";
import classes from "./EditEmployee.module.css";
import { closeIcon } from "../../../icons/icons";
import EditEmployeeDetails from "../EditEmployee/DetailsTab/EditEmployeeDetails";
import EditEmployeeSchedule from "../EditEmployee/ScheduleTab/EditEmployeeSchedule";
import EditEmployeeVacation from "../EditEmployee/VacationTab/EditEmployeeVacation";
import Documets from "./DocumentsTab/Documets";
import AddVacations from "./VacationTab/AddVacations";
import { Employee } from "../StaffTypes";
import OutsideClickHandler from "../components/OutsideClickHandler";
import EditEmployeeSales from "./SalesTab/EditEmployeeSales";

type EditEmployeeProps = {
  employee: Employee;
  onCloseSidebar: () => void;
  setEmployee: (updatedEmployee: Employee) => void;
  setNewFetch: (value) => void;
};

const EditEmployee: React.FC<EditEmployeeProps> = ({
  employee,
  onCloseSidebar,
  setEmployee,
  setNewFetch,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [showAddVacationForm, setShowAddVacationForm] = useState(false);

  const handleAddVacationClick = () => {
    setShowAddVacationForm(true);
  };

  const handleCancelAddVacation = () => {
    setShowAddVacationForm(false);
  };

  function filterAndSortVacations(vacations, vacationType) {
    if (!vacations) return [];

    const filteredVacations = vacations
      .filter((vacation) => vacation.vacationType === vacationType)
      .sort((a, b) => {
        if (!a.endDate && !b.endDate) {
          return 0;
        } else if (!a.endDate) {
          return 1;
        } else if (!b.endDate) {
          return -1;
        } else {
          const dateA = new Date(a.endDate);
          const dateB = new Date(b.endDate);
          return dateB.getTime() - dateA.getTime();
        }
      });

    return filteredVacations;
  }

  const sickVacations = filterAndSortVacations(
    employee.vacations,
    "SICK_VACATION"
  );
  const latestSickVacation = sickVacations[0];
  const SickDays = latestSickVacation?.availableDays || 0;

  const specialVacations = filterAndSortVacations(
    employee.vacations,
    "SPECIAL_VACATION"
  );
  const latestSpecialVacation = specialVacations[0];
  const specialDays = latestSpecialVacation?.availableDays || 0;

  const simpleVacations = filterAndSortVacations(
    employee.vacations,
    "SIMPLE_VACATION"
  );
  const latestSimpleVacation = simpleVacations[0];
  const AvaliableDays = latestSimpleVacation?.availableDays || 0;

  const employeeBoxRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className={classes.EditEmployeeModal}>
        {activeTab === "vacations" && showAddVacationForm ? (
          <AddVacations
            onCancel={handleCancelAddVacation}
            onCloseSideBar={onCloseSidebar}
            employee={employee}
            AvaliableDays={AvaliableDays}
            SickDays={SickDays}
            SpecialDays={specialDays}
            onVacationAdd={handleCancelAddVacation}
            setEmployee={setEmployee}
          />
        ) : (
          <div ref={employeeBoxRef} className={classes.EditEmployeeBox}>
            <OutsideClickHandler
              innerRef={employeeBoxRef}
              onClose={onCloseSidebar}
            />
            <div className={classes.BoxHead}>
              <p className={classes.BoxHeadTitle}>
                Edit employee · {employee.username} · <span className={classes.codeLabel}> Code: <span style={{textDecoration: "underline"}}>{employee.waiterCode}</span></span>
              </p>
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
              <div
                className={`${classes.BoxListItem} ${
                  activeTab === "schedule" ? classes.ActiveTab : ""
                }`}
                onClick={() => handleTabClick("schedule")}
              >
                <p className={classes.BoxListItemText}>Schedule</p>
              </div>
              <div
                className={`${classes.BoxListItem} ${
                  activeTab === "vacations" ? classes.ActiveTab : ""
                }`}
                onClick={() => handleTabClick("vacations")}
              >
                <p className={classes.BoxListItemText}>Vacations</p>
              </div>
              <div
                className={`${classes.BoxListItem} ${
                  activeTab === "documents" ? classes.ActiveTab : ""
                }`}
                onClick={() => handleTabClick("documents")}
              >
                <p className={classes.BoxListItemText}>
                  Documents{"   "}
                  {employee.documents !== undefined &&
                    employee.documents.length > 0 && (
                      <div
                        className={`${classes.DocumentLength} ${
                          activeTab === "documents"
                            ? classes.DocumentLengthActive
                            : ""
                        }`}
                      >
                        <span className={classes.DocumentLengthText}>
                          {employee.vacations !== undefined &&
                            employee.vacations
                              .filter(
                                (vacation) => vacation.status !== "DECLINED"
                              )
                              .filter((vacation) => vacation.endDate !== null)
                              .length + employee.documents.length}
                        </span>
                      </div>
                    )}
                </p>
              </div>
              <div
                className={`${classes.BoxListItem} ${
                  activeTab === "sales" ? classes.ActiveTab : ""
                }`}
                onClick={() => handleTabClick("sales")}
              >
                <p className={classes.BoxListItemText}>Sales</p>
              </div>
            </div>
            {activeTab === "details" && (
              <EditEmployeeDetails
                employee={employee}
                onCloseSidebar={onCloseSidebar}
                setEmployee={setEmployee}
                setNewFetch={setNewFetch}
              />
            )}
            {activeTab === "schedule" && (
              <EditEmployeeSchedule employee={employee} />
            )}
            {activeTab === "vacations" && showAddVacationForm === false && (
              <EditEmployeeVacation
                employee={employee}
                onAddVacationClick={handleAddVacationClick}
                AvaliableDays={AvaliableDays}
                SickDays={SickDays}
                SpecialDays={specialDays}
                setEmployee={setEmployee}
              />
            )}
            {activeTab === "documents" && (
              <Documets
                employee={employee}
                documents={employee.documents}
                vacations={employee.vacations}
                onCloseSideBar={onCloseSidebar}
              />
            )}
            {activeTab === "sales" && (
              <EditEmployeeSales employee={employee} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EditEmployee;
