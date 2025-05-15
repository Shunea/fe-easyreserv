import dayjs from "dayjs";
import { vacationDateIcon } from "../../icons/icons";
import { Employee } from "../Staff/StaffTypes";
import classes from "./Vacations.module.css";

type Props = {
  employees: Employee[];
};
const Vacations = (props: Props) => {
  const vacations: any = [];
  for (const employee of props.employees) {
    vacations.push(employee.vacation);
  }

  const sortedVacations = vacations.sort(
    (a, b) => dayjs(a?.startDate).valueOf() - dayjs(b?.startDate).valueOf()
  );
  const employeesWithVacations = props.employees
    .map((employee) => ({
      ...employee,
      vacations: sortedVacations,
    }))
    .filter((employee) => employee.vacations.length > 0);
  // const employeesWithVacations = props.employees
  //   .map((employee) => ({
  //     ...employee,
  //     vacations: vacations
  //       ? vacations.sort(
  //           (a, b) => a?.startDate?.getTime() - b?.startDate?.getTime()
  //         )
  //       : [],
  //   }))
  // .filter((employee) => employee.vacations.length > 0);
  const DEFAULT_IMAGE = "/staffImages/barmen.png";

  return (
    <div className={classes.Vacations}>
      <div className={classes.VacationsHead}>
        <label className={classes.VacationsHeadText}>Upcoming vacations</label>
      </div>
      <div className={classes.VacationsContent}>
        <div className={classes.VacationsList}>
          {employeesWithVacations.map((employee) =>
            employee.vacation !== null ? (
              <div key={employee.id} className={classes.VacationRow}>
                <div className={classes.EmployeeNameContainer}>
                  <div className={classes.EmployeeAvatar}>
                    <img
                      src={
                        employee.avatarUrl ? employee.avatarUrl : DEFAULT_IMAGE
                      }
                      alt={employee.username}
                      className={classes.EmployeeAvatarImage}
                    />
                  </div>
                  <div className={classes.EmployeeName}>
                    <span className={classes.EmployeeNameText}>
                      {employee.username}
                    </span>
                    <div className={classes.VacationDateContainer}>
                      <span className={classes.VacationDateIcon}>
                        {vacationDateIcon}
                      </span>
                      <span className={classes.VacationDateText}>
                        {dayjs(employee.vacation?.startDate).format("DD MMMM") +
                          "-" +
                          dayjs(employee.vacation?.endDate).format(
                            "DD MMMM YYYY"
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
export default Vacations;
