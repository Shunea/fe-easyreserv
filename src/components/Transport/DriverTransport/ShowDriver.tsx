import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createDriver,
  getAllStaff,
  getAllStaffForTransport,
  getDrivers,
  userData,
} from "../../../auth/api/requests";
import { plusSizeIcon, searchSupplierIcon } from "../../../icons/icons";
import classes from "../CreateTransport/CreateTransport.module.css";
import CheckboxComponent from "src/components/Staff/EditEmployee/VacationTab/CheckboxComponent";
import CreateDriver from "./CreateDriver";
import AddEmployeeButton from "src/components/Staff/AddEmployee/AddEmployeeButton";
import InviteModal from "src/components/Staff/AddEmployee/InviteModal";
import { Employee } from "src/components/Staff/StaffTypes";
type Props = {
  handleClose: () => void;
  transportArray: Transport[] | undefined;
  selectedDrivers: userData[];
  onSelectDrivers: (drivers: userData[]) => void;
};
type Transport = {
  id: string;
  registrationNumber: string;
  type: string;
  seats: number;
  mileage: number;
  region: string;
  restaurantId: string;
  users: userData[];
};
type User = {
  id: string;
  username: string;
  avatar: string;
};
const ShowDriver = ({
  handleClose,
  transportArray,
  selectedDrivers,
  onSelectDrivers,
}: Props) => {
  type Filter = {
    sortBy?: {
      column: string;
      order: string;
    };
    search?: string;
    pagination?: number;
  };

  // const [drivers, setDrivers] = useState<User[]>([]);
  // const [selectedDriver, setSelectedDriver] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEmployees = async (page:number) => {
      try {
        const response = await getAllStaffForTransport(page);
        if (Array.isArray(response.data)) {
          const filteredEmployees = response.data.filter(
            (employee) => employee.role === "DRIVER"
          );
          setEmployees(filteredEmployees);
        } else {
          console.error("getAllStaff did not return an array:", response);
        }
        setTotalPages(response.pagination.totalPages);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setTimeout(setLoading.bind(null, false), 500);
      }
    };
    const fetchAllEmployees = async () => {
      setLoading(true);
      setEmployees([]);
      for (let page = 1; page <= totalPages; page++) {
        await fetchEmployees(page);
      }
    };

    fetchAllEmployees();
  }, []);

  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const handleEditSearchValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
    const filteredData = employees.filter((employee) => {
      const username = employee.username.toLowerCase().includes(value);
      return username;
    });
    setFilteredData(filteredData);
  };
  const usersToDisplay = filteredData.length > 0 ? filteredData : employees;

  const handleCheckboxChange = (driver) => {
    const index = selectedDrivers.findIndex(
      (selectedDriver) => selectedDriver.id === driver.id
    );
    if (index === -1) {
      onSelectDrivers([...selectedDrivers, driver]); // Add driver to the selectedDrivers array
    } else {
      const updatedSelectedDrivers = [...selectedDrivers];
      updatedSelectedDrivers.splice(index, 1); // Remove driver from the selectedDrivers array

      onSelectDrivers(updatedSelectedDrivers);
    }
  };

  const disabled = selectedDrivers === null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [createDriver, setCreateDriver] = useState(false);
  const handleChangeCreateDriver = () => {
    //   setCreateDriver((prevState) => !prevState);
    if (setIsModalOpen) {
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }
  };
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";

  return (
    <>
      {/* {createDriver === true ? (
        <CreateDriver
          onCancel={handleChangeCreateDriver}
          onCloseSideBar={handleClose}
          setDrivers={setDrivers}
          drivers={drivers}
        />
      ) : ( */}
      <div className={classes.BoxFormContainer}>
        <section className={classes.BoxFormSection}>
          <div className={classes.SupplierContent}>
            <div
              className={classes.InputContainer}
              style={{ position: "relative", width: "100%" }}
            >
              <div className={classes.SearchIcon}>{searchSupplierIcon}</div>
              <input
                type="text"
                value={searchValue}
                onChange={handleEditSearchValue}
                className={classes.InputField}
                placeholder="Search for a driver"
              ></input>
            </div>
            <div className={classes.SupplierListContainer}>
              <div className={classes.SupplierList}>
                {usersToDisplay.map((driver) => (
                  <div className={classes.SupplierRow} key={driver.id}>
                    <CheckboxComponent
                      vacation={driver}
                      onCheckboxChange={handleCheckboxChange}
                      isChecked={selectedDrivers.some(
                        (selectedDriver) => selectedDriver.id === driver.id
                      )}
                    />
                    <div className={classes.SupplierNameContainer}>
                      <img
                        src={
                          driver?.avatar?.startsWith("avatar_")
                            ? require(`../../../assets/${driver?.avatar}`)
                                .default
                            : driver?.avatar !== null &&
                              !driver?.avatar?.startsWith("avatar_")
                            ? driver?.avatarUrl
                            : DEFAULT_IMAGE
                        }
                        alt={driver.username}
                        className={classes.SupplierImage}
                      />
                      <div className={classes.SupplierNameBox}>
                        <label className={classes.SupplierName}>
                          {driver.username}
                        </label>
                      </div>
                    </div>
                    {/* ))} */}
                  </div>
                ))}
              </div>
              <button
                className={classes.AddSupplierButton}
                onClick={handleChangeCreateDriver}
              >
                <span
                  style={{
                    color: "#FE9800",
                    height: "20px",
                    width: "20px",
                  }}
                >
                  {plusSizeIcon}
                </span>
                <span className={classes.AddSupplierText}>Add new driver</span>
              </button>
            </div>
          </div>
        </section>
        {/* <div className={classes.BoxAction}>
          <button
            className={classes.SaveItemButton}
            // onClick={handleChangeCreateDriver}
            disabled={disabled}
          >
            <span className={classes.SaveItemText}>Save transport</span>
          </button>
        </div> */}
      </div>
      {/* )} */}
      {isModalOpen && <InviteModal onClose={handleCloseModal} />}
    </>
  );
};
export default ShowDriver;
