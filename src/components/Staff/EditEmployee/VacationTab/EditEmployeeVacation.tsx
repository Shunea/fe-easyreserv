import { format } from "date-fns";
import React, { useRef, useState } from "react";
import {
  acceptIcon,
  alertIcon,
  closeIcon,
  downloadIcon,
  healthIcon,
  plusIcon,
  restIcon,
  sunIcon,
} from "src/icons/icons";
import { updateVacation } from "../../../../auth/api/requests";
import CheckboxComponent from "./CheckboxComponent";
import classes from "./EditEmployeeVacation.module.css";
import NoVacationMessage from "./NoVacationMessage";
import ReactToPrint from "react-to-print";
import VacationPDF from "./VacationPDF";
import { Employee, Vacation } from "../../StaffTypes";
import { toast } from "react-toastify";

type EditEmployeeVacationProps = {
  employee: Employee;
  onAddVacationClick: any;
  AvaliableDays: number;
  SickDays: number;
  SpecialDays: number;
  setEmployee: (updatedEmployee: Employee) => void;
};

const EditEmployeeVacation: React.FC<EditEmployeeVacationProps> = ({
  employee,
  onAddVacationClick,
  AvaliableDays,
  SickDays,
  SpecialDays,
  setEmployee,
}) => {
  const handleAddVacationButtonClick = () => {
    onAddVacationClick();
  };
  const [exportButton, setExportButton] = useState(true);
  const handleClickExportButton = () => {
    setExportButton((prevExportButton) => !prevExportButton);
  };

  const handleClickwithdrawButton = (vacationId) => {
    setWithdrawButtonStates((prevStates) => ({
      ...prevStates,
      [vacationId]: !prevStates?.[vacationId],
    }));
  };

  const initialWithdrawButtonStates = employee?.vacations?.reduce(
    (acc, vacation) => {
      acc[vacation.id] = true;
      return acc;
    },
    {}
  );

  const [withdrawButtonStates, setWithdrawButtonStates] = useState(
    initialWithdrawButtonStates
  );

  const notify = () =>
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

  const handleUpdateVacation = async (vacationId: string) => {
    const todayDate = new Date();

    try {
      if (employee.vacations) {
        const updatedEmployee = { ...employee };
        const updatedVacations = await Promise.all(
          (updatedEmployee.vacations ?? []).map(async (vacation: Vacation) => {
            if (vacation.id === vacationId) {
              const vacationData = {
                startDate: vacation.startDate,
                endDate: todayDate,
              };

              const updatedVacation = await updateVacation(
                vacation.id,
                vacationData
              );

              return updatedVacation;
            } else {
              return vacation;
            }
          })
        );

        updatedEmployee.vacations = updatedVacations;
        setEmployee(updatedEmployee);
        notify();
      }
    } catch (error) {
      console.error("Can't update vacation:", error);
    }
  };

  const componentRef = useRef(null);

  const [oneVacation, setOneVacation] = useState<Vacation | null>(null);

  const handleButtonMouseEnter = (vacation: Vacation) => {
    setOneVacation(vacation);
  };

  const handleButtonMouseLeave = () => {
    setOneVacation(null);
  };

  const [selectedVacations, setSelectedVacations] = useState<Vacation[]>([]);
  const handleCheckboxChange = (vacationId) => {
    if (selectedVacations.includes(vacationId)) {
      setSelectedVacations(selectedVacations.filter((id) => id !== vacationId));
    } else {
      setSelectedVacations([...selectedVacations, vacationId]);
    }
  };

  return (
    <div className={classes.VacationContent}>
      <div className={classes.VacationRow}>
        <div className={classes.VacationCard}>
          <div className={classes.VacationIcon}>
            <div className={classes.VacationIconContainerS}>{sunIcon}</div>
          </div>
          <div className={classes.VacationCardContent}>
            <span className={classes.VacationValue}>{AvaliableDays} days</span>
            <label className={classes.VacationLabel}>available vacation</label>
          </div>
        </div>
        <div className={classes.VacationCardSick}>
          <div className={classes.VacationIcon}>
            <div className={classes.VacationIconContainerH}>{healthIcon}</div>
          </div>
          <div className={classes.VacationCardContent}>
            <span className={classes.VacationValue}>{SickDays} days</span>
            <label className={classes.VacationLabel}>
              available sick leave
            </label>
          </div>
        </div>
        <div className={classes.VacationCardOff}>
          <div className={classes.VacationIcon}>
            <div className={classes.VacationIconContainerR}>{restIcon}</div>
          </div>
          <div className={classes.VacationCardContent}>
            <span className={classes.VacationValue}>{SpecialDays} days</span>
            <label className={classes.VacationLabel}>special days off</label>
          </div>
        </div>
      </div>
      {employee.vacations && employee.vacations.length <= 3 && (
        <NoVacationMessage onClick={handleAddVacationButtonClick} />
      )}
      {employee.vacations &&
        employee.vacations.some(
          (vacation) => vacation.startDate && vacation.endDate !== null
        ) && (
          <div className={classes.List}>
            <div className={classes.Heading}>
              <label className={classes.HeadingTitle}>
                Scheduled vacations
              </label>
              {exportButton ? (
                <button
                  className={classes.Export}
                  onClick={handleClickExportButton}
                  style={{ display: "none" }}
                >
                  <span className={classes.ExportIcon}>{downloadIcon}</span>
                  <span className={classes.ExportText}>Export</span>
                </button>
              ) : null}
            </div>
            <div className={classes.VacationList}>
              {employee.vacations
                .filter(
                  (vacation) => vacation.startDate && vacation.endDate !== null
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
                  <div className={classes.VacationItem} key={vacation.id}>
                    {exportButton ? null : (
                      <CheckboxComponent
                        vacation={vacation}
                        onCheckboxChange={handleCheckboxChange}
                      />
                    )}

                    <div className={classes.VacationItemCard}>
                      <div className={classes.CardHead}>
                        <div className={classes.HeadTitle}>
                          <div className={classes.TitleHeading}>
                            <span className={classes.VacationItemIcon}>
                              {vacation.vacationType === "SIMPLE_VACATION"
                                ? sunIcon
                                : vacation.vacationType === "SICK_VACATION"
                                ? healthIcon
                                : restIcon}
                            </span>
                            <span className={classes.VacationTitle}>
                              Vacation
                            </span>
                            <span className={classes.VacationID}>
                              {vacation.vacationIdentifier}
                            </span>
                          </div>
                        </div>
                        <div className={classes.HeadActions}>
                          {vacation.startDate &&
                            vacation.endDate &&
                            new Date() >= new Date(vacation.startDate) &&
                            new Date() <= new Date(vacation.endDate) && (
                              <>
                                <button
                                  className={`${
                                    classes.HeadNotificationButton
                                  } ${
                                    withdrawButtonStates?.[vacation.id]
                                      ? ""
                                      : classes.withdraw
                                  }`}
                                  onClick={() =>
                                    handleClickwithdrawButton(vacation.id)
                                  }
                                >
                                  <span
                                    className={`${classes.HeadButtonIcon} ${
                                      withdrawButtonStates?.[vacation.id]
                                        ? ""
                                        : classes.withdrawIcon
                                    }`}
                                  >
                                    {alertIcon}
                                  </span>
                                </button>
                              </>
                            )}
                          <ReactToPrint
                            onBeforeGetContent={() => {
                              setOneVacation(vacation);
                            }}
                            trigger={() => (
                              <button
                                className={classes.HeadButton}
                                onMouseEnter={() =>
                                  handleButtonMouseEnter(vacation)
                                } // Set selected vacation on hover
                                onMouseLeave={handleButtonMouseLeave}
                              >
                                <span className={classes.HeadButtonIcon}>
                                  {downloadIcon}
                                </span>
                              </button>
                            )}
                            content={() => componentRef.current}
                          />
                        </div>
                      </div>
                      <div className={classes.CardContent}>
                        <div className={classes.CardContentForm}>
                          <div className={classes.CardContentFormItem}>
                            <span className={classes.VacationTitle}>
                              {format(
                                new Date(vacation.startDate),
                                "dd MMMM yyyy"
                              )}
                            </span>
                          </div>
                          <span className={classes.Line}></span>
                          {vacation.endDate !== vacation.startDate ? (
                            <div className={classes.CardContentFormItem}>
                              <span className={classes.VacationTitle}>
                                {format(
                                  new Date(vacation.endDate),
                                  "dd MMMM yyyy"
                                )}
                              </span>
                            </div>
                          ) : null}
                        </div>
                        {vacation.startDate &&
                          vacation.endDate &&
                          new Date() >= new Date(vacation.startDate) &&
                          new Date() <= new Date(vacation.endDate) && (
                            <>
                              {!withdrawButtonStates?.[vacation.id] && (
                                <>
                                  <div className={classes.WithdrawModal}>
                                    <div className={classes.ModalContent}>
                                      <span className={classes.ModalText}>
                                        Are you sure you want to withdraw the
                                        employee from vacation?
                                      </span>
                                      <div className={classes.ModalActions}>
                                        <button
                                          className={classes.ModalDeclineButton}
                                        >
                                          {closeIcon}
                                        </button>
                                        <button
                                          className={classes.ModalAcceptButton}
                                          onClick={() =>
                                            handleUpdateVacation(vacation.id)
                                          }
                                        >
                                          {acceptIcon}
                                        </button>
                                      </div>
                                    </div>
                                    <div className={classes.Arrow}></div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className={classes.VacationAction}>
              {exportButton ? (
                <button
                  className={classes.VacationButton}
                  onClick={handleAddVacationButtonClick}
                >
                  <span className={classes.plusIcon}>{plusIcon}</span>
                  <span className={classes.VacationButtonText}>
                    Add vacation
                  </span>
                </button>
              ) : (
                <>
                  <button
                    className={classes.VacationCancelButton}
                    onClick={handleClickExportButton}
                  >
                    <span className={classes.CancelButtonText}>Cancel</span>
                  </button>
                  <ReactToPrint
                    trigger={() => (
                      <button className={classes.VacationExportButton}>
                        <span className={classes.exportIcon}>
                          {downloadIcon}
                        </span>
                        <span className={classes.ExportToPDFText}>
                          Export to PDF
                        </span>
                      </button>
                    )}
                    content={() => componentRef.current}
                  />
                </>
              )}
            </div>
          </div>
        )}
      <div style={{ display: "none" }}>
        {oneVacation ? (
          <VacationPDF
            employee={employee}
            vacation={oneVacation}
            ref={componentRef}
          />
        ) : selectedVacations.length > 0 ? (
          selectedVacations.map((vacation) => (
            <VacationPDF
              key={vacation.id}
              employee={employee}
              vacation={vacation}
              ref={componentRef}
            />
          ))
        ) : null}
      </div>
    </div>
  );
};
export default EditEmployeeVacation;
