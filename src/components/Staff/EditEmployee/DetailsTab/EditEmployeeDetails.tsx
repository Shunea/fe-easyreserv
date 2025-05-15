import React, { useEffect, useState } from "react";
import useInput from "../../../../hooks/use-input";
import Select from "../../../../UI/Select";
import {
  CustomDropDownIcon,
  VacationCalendarIcon,
} from "../../../../icons/icons";
import classes from "./EditEmployeeDetails.module.css";
import { deleteUser, updateStaff, uploadImage, getAllUsers, getAllDepartments, getAllStaffForDashboard } from "src/auth/api/requests";
import { toast } from "react-toastify";
import DragAndDrop from "../../../CreatePlace/Form/DragAndDrop";
import { components } from "react-select";
import SaveChangesButton from "./SaveChangesButton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Employee } from "../../StaffTypes";
import CurrencyInput from "react-currency-input-field";
import Compressor from "compressorjs";
import TimeTable from "../../OverviewCalendar/TimeTable";
import CustomSelect from "../components/CustomSelect";

type EditEmployeeDetailsProps = {
  employee: Employee;
  onCloseSidebar: () => void;
  setEmployee: (updatedEmployee: Employee) => void;
  setNewFetch: (value) => void;
};

interface Role {
  value: string;
  label: string;
  __isNew__?: boolean;
  roleName?: string;
}

const EditEmployeeDetails: React.FC<EditEmployeeDetailsProps> = ({
  employee,
  setEmployee,
  onCloseSidebar,
  setNewFetch,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(employee.phoneNumber);
  const [valid, setValid] = useState(true);

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{10,14}$/;

    return phoneNumberPattern.test(phoneNumber);
  };

  const isNotEmpty = (value: string) => value.trim() !== "";

  const {
    value: fullName,
    valueChangeHandler: fullNameChangedHandler,
    inputBlurHandler: fullNameBlurHandler,
  } = useInput(isNotEmpty, employee.username || "");

  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(() => ({
    value: employee?.department || '',
    label: employee?.department || ''
  }));

  const handleDepartmentChange = (selectedOption: any) => {
    setSelectedDepartment(selectedOption);
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departments = await getAllDepartments();
        setDepartmentOptions(departments);
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    };
    
    loadDepartments();
  }, []);

  const {
    value: email,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value: string) => value.includes("@"), employee.email || "");

  const employeeRoles: Role[] = [
    { value: "SUPER_HOSTESS", label: "Head Hostess" },
    { value: "ADMIN", label: "Admin" },
    { value: "BARTENDER", label: "Bartender" },
    { value: "WAITER", label: "Waiter" },
    { value: "CHEF", label: "Chef" },
    { value: "HOSTESS", label: "Hostess" },
    { value: "OPERATOR", label: "Operator" },
    { value: "SPECIALIST", label: "Specialist" },
    { value: "DRIVER", label: "Driver" },
    { value: "STAFF_ACCESS_CONTROL", label: "Staff Access Control" },
  ];

  const [roles, setRoles] = useState<Role[]>(employeeRoles);

  const [selectedRole, setSelectedRole] = useState<Role>(() => {
    const standardRole = employeeRoles.find(role => role.value === employee.role);
    
    if (employee.role === 'GENERAL' && employee.roleName) {
      return {
        value: employee.roleName,
        label: employee.roleName,
        __isNew__: true
      };
    }
    
    if (standardRole) {
      return standardRole;
    }
    
    return {
      value: employee.role || '',
      label: employee.roleName || employee.role || '',
      __isNew__: true
    };
  });

  const [selectedSalaryType, setSelectedSalaryType] = useState(employee.salaryType || "");

  const [formChanged, setFormChanged] = useState(true);

  const handleRoleChange = (selectedOption: Role) => {
    const newRole: Role = {
      value: selectedOption.value,
      label: selectedOption.label || selectedOption.value,
      __isNew__: selectedOption.__isNew__
    };
    setSelectedRole(newRole);
    if (newRole.__isNew__) {
      setRoles(prevRoles => [...prevRoles, newRole]);
    }
  };

  const handleSalaryTypeChange = (selectedOption: { value: string; label: string }) => {
    setSelectedSalaryType(selectedOption.value);
  };

  const [showTimeTable, setShowTimeTable] = useState(false);
  const [fullEmployeeData, setFullEmployeeData] = useState(employee);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const allStaff = await getAllStaffForDashboard();
        const currentEmployee = allStaff.find(emp => emp.id === employee.id);
        if (currentEmployee) {
          setFullEmployeeData(currentEmployee);
        }
      } catch (error) {}
    };

    fetchFullData();
  }, [employee.id]);

  useEffect(() => {
    if (showTimeTable) {
      console.log('TimeTable data:', {
        showTimeTable,
        employee: fullEmployeeData,
        staffSchedules: fullEmployeeData?.staffSchedules
      });
    }
  }, [showTimeTable, fullEmployeeData]);

  const handleCloseSidebar = () => {
    setShowTimeTable(false);
  };
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

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        {CustomDropDownIcon}
      </components.DropdownIndicator>
    );
  };

  const CustomRoleSelect = (props: any) => {
    const customStyles = {
      dropdownIndicator: (provided: any) => ({
        ...provided,
        width: "40px",
        height: "40px",
      }),

      control: (provided: any, state: any) => ({
        ...provided,
        display: "flex",
        height: "52px",
        padding: "0px 8px",
        alignItems: "center",
        gap: "8px",
        alignSelf: "stretch",
        borderRadius: "12px",
        border: "1px solid #EEE !important",
        backgroundColor: "var(--brand-snow, #FFF)",
        boxShadow: "0 0 0 1px #EEE",

        "&:focus-within": {
          boxShadow: "0 0 0 1.5px rgba(254, 152, 0, 1)",
          outlineColor: "red",
        },
      }),

      container: (provided: any, state: any) => ({
        ...provided,
        marginTop: "12px",
      }),
    };
    return (
      <>
        <div className={classes.customSelect}>
          {props.label && (
            <p id={props.id} className={classes.label}>
              {props.label}
            </p>
          )}
          <Select
            name={props.name}
            styles={customStyles}
            onChange={handleRoleChange}
            value={selectedRole}
            placeholder={props.placeholder}
            options={roles}
            components={{ DropdownIndicator }}
            {...{
              isSearchable: true,
              isCreatable: false,
              createOptionPosition: 'first'
            }}
          />
        </div>
      </>
    );
  };

  const CustomSalaryTypeSelect = (props: any) => {
    const customStyles = {
      dropdownIndicator: (provided: any) => ({
        ...provided,
        width: "40px",
        height: "40px",
      }),

      control: (provided: any, state: any) => ({
        ...provided,
        display: "flex",
        height: "52px",
        padding: "0px 8px",
        alignItems: "center",
        gap: "8px",
        alignSelf: "stretch",
        borderRadius: "12px",
        border: "1px solid #EEE !important",
        backgroundColor: "var(--brand-snow, #FFF)",
        boxShadow: "0 0 0 1px #EEE",

        "&:focus-within": {
          boxShadow: "0 0 0 1.5px rgba(254, 152, 0, 1)",
          outlineColor: "red",
        },
      }),

      container: (provided: any, state: any) => ({
        ...provided,
        marginTop: "12px",
      }),
    };
    return (
      <>
        <div className={classes.customSelect}>
          {props.label && (
            <p id={props.id} className={classes.label}>
              {props.label}
            </p>
          )}
          <Select
            name={props.name}
            styles={customStyles}
            value={employeeSalaryType.find(
              (option) => option.value === selectedSalaryType
            )}
            onChange={handleSalaryTypeChange}
            placeholder={props.placeholder}
            options={employeeSalaryType}
            components={{ DropdownIndicator }}
            {...{ isSearchable: false }}
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const fetchedRoles = await getAllUsers();
        setRoles(prevRoles => {
          const allRoles = [...prevRoles];
          (fetchedRoles as Role[]).forEach((role: Role) => {
            if (!allRoles.some(r => r.value === role.value)) {
              allRoles.push(role);
            }
          });
          return allRoles;
        });
      } catch (error) {
      }
    };
    
    loadRoles();
  }, []);

  const employeeSalaryType = [
    { value: "MONTHLY", label: "Monthly" },
    { value: "HOURLY", label: "Hourly" },
  ];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  interface EmployeeSubmit {
    username?: any;
    email?: any;
    phoneNumber?: any;
    role?: any;
    roleName?: string;
    salary?: any;
    salaryType?: any;
    department?: string;
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (formIsValid) {
        const updatedEmployee: EmployeeSubmit = {};
        
        if (fullName !== employee.username) {
          updatedEmployee.username = fullName;
        }
        if (selectedDepartment?.value !== employee.department) {
          updatedEmployee.department = selectedDepartment.value;
        }
        if (email !== employee.email) {
          updatedEmployee.email = email;
        }
        if (phoneNumber !== employee.phoneNumber) {
          updatedEmployee.phoneNumber = `+${phoneNumber}`;
        }
        if (selectedRole.value !== employee.role) {
          const isStandardRole = roles.some(
            role => role.value === selectedRole.value
          );

          if (isStandardRole) {
            updatedEmployee.role = selectedRole.value;
            updatedEmployee.roleName = undefined;
          } else {
            updatedEmployee.role = 'GENERAL';
            updatedEmployee.roleName = selectedRole.label;
          }
        }
        if (selectedSalaryType !== employee.salaryType) {
          updatedEmployee.salaryType = selectedSalaryType;
        }
        if (Number(salary) !== employee.salary && Number(salary) !== 0) {
          updatedEmployee.salary = Number(salary);
        }
        const updatedEmployeeData = await updateStaff(
          employee.id,
          updatedEmployee
        );
        notify();
        setEmployee(updatedEmployeeData);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const [salary, setSalary] = useState<string | undefined>(
    `${employee.salary === null ? "" : employee.salary}`
  );

  const handleOnValueChange = (salary: string | undefined): void => {
    setSalary(salary);
  };

  useEffect(() => {
    const hasFormChanged =
      fullName !== employee.username ||
      selectedDepartment.value !== employee.department ||
      email !== employee.email ||
      phoneNumber !== employee.phoneNumber ||
      selectedRole.value !== employee.role ||
      selectedSalaryType !== employee.salaryType ||
      uploadedFile !== null ||
      (Number(salary) !== employee.salary && Number(salary) !== 0);

    setFormChanged(hasFormChanged);
  }, [
    fullName,
    selectedDepartment,
    email,
    phoneNumber,
    selectedRole.value,
    employee,
    uploadedFile,
    salary,
    selectedSalaryType,
  ]);

  const formIsValid =
    formChanged &&
    ((fullName && employee.username !== "") ||
      (selectedDepartment.value && employee.department !== "") ||
      (email && employee.email !== "") ||
      (phoneNumber && employee.phoneNumber !== "")) &&
    valid === true &&
    selectedRole.value !== "" &&
    selectedSalaryType !== "" &&
    !submitted;

  const preferedCountries = ["md", "ro", "ae", "il", "it", "si"];

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

  const eroare = (text) =>
    toast.error(text, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleDeleteUser = async (employeeId) => {
    try {
      await deleteUser(employeeId);
      succes();
      setNewFetch((prevState) => !prevState);
      onCloseSidebar();
    } catch (error) {
      eroare(error);
    }
  };

  const CustomDepartmentSelect = (props: any) => {
    const customStyles = {
      dropdownIndicator: (provided: any) => ({
        ...provided,
        width: "40px",
        height: "40px",
      }),

      control: (provided: any) => ({
        ...provided,
        display: "flex",
        height: "52px",
        padding: "0px 16px",
        alignItems: "center",
        gap: "8px",
        alignSelf: "stretch",
        borderRadius: "12px",
        border: "1px solid #eee",
        background: "var(--brand-snow, #fff)",
        boxShadow: "none",
        width: "350px",

        "&:hover": {
          border: "1px solid #eee",
        },

        "&:focus-within": {
          boxShadow: "0 0 0 1.5px rgba(254, 152, 0, 1)",
          border: "1px solid #eee",
        },
      }),

      container: (provided: any) => ({
        ...provided,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        flex: "1 0 0",
        alignSelf: "stretch",
      }),
    };

    return (
      <div className={classes.BoxFormInputContainerDepartament}>
        {props.label && (
          <p id={props.id} className={classes.label}>
            {props.label}
          </p>
        )}
        <Select
          name={props.name}
          styles={customStyles}
          onChange={handleDepartmentChange}
          value={selectedDepartment}
          placeholder={props.placeholder}
          options={departmentOptions}
          components={{ DropdownIndicator }}
        />
      </div>
    );
  };

  return showTimeTable ? (
    <TimeTable
      employee={fullEmployeeData}
      onBack={handleCloseSidebar}
      onClose={handleCloseSidebar}
    />
  ) : (
    <form className={classes.BoxForm} onSubmit={handleSubmit}>
      <div className={classes.BoxFormDrag}>
        <DragAndDrop
          onFileUpload={handleFileUpload}
          background={
            employee.avatar?.startsWith("avatar_")
              ? require(`../../../../assets/${employee?.avatar}`).default
              : employee?.avatar !== null &&
                !employee?.avatar?.startsWith("avatar_")
              ? employee?.avatarUrl
              : null
          }
          isRequired={isRequired}
        />
      </div>
      <div className={classes.BoxFormRow}>
        <div className={classes.BoxFormInputContainer}>
          <label htmlFor="name" className={classes.label}>
            Full name
          </label>
          <input
            className={classes.BoxFormInput}
            type="text"
            id="name"
            placeholder="Enter employee's name and surname"
            onChange={fullNameChangedHandler}
            onBlur={fullNameBlurHandler}
            defaultValue={employee.username}
          />
        </div>
        <div className={classes.BoxFormInputContainerDepartament}>
          <label htmlFor="department" className={classes.label}>
            Department
          </label>
          <CustomDepartmentSelect
            className={classes.BoxFormInput}
            name="department"
            onChange={handleDepartmentChange}
            value={selectedDepartment}
            placeholder="Select the department"
            options={departmentOptions}
            components={{ DropdownIndicator }}
          />
        </div>
      </div>
      <div className={classes.BoxFormRow}>
        <div className={classes.BoxFormSelect}>
          <CustomRoleSelect
            labelId="role-label"
            value={selectedRole}
            label="Role"
            variant="outlined"
            options={roles}
            placeholder="Select the role"
            isCreatable={true}
            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
          />
        </div>
        <div className={classes.BoxFormSelect}>
          <CustomSalaryTypeSelect
            labelId="salarytype-label"
            value={selectedSalaryType}
            label="Salary Type"
            variant="outlined"
            options={employeeSalaryType}
            placeholder="Select the salary type"
          />
        </div>
        <div className={classes.BoxFormInputContainerSalary}>
          <label htmlFor="name" className={classes.label}>
            Salary
          </label>
          <CurrencyInput
            className={classes.BoxFormInput}
            type="text"
            id="salary"
            placeholder="Enter employee's salary"
            onValueChange={handleOnValueChange}
            value={salary !== null ? salary : 0}
            // defaultValue={employee.salary}
            suffix={salary === null ? "" : " lei"}
          />
        </div>
      </div>
      <div className={classes.BoxFormRow}>
        <div className={classes.BoxFormInputContainer}>
          <label htmlFor="email" className={classes.label}>
            E-mail address
          </label>
          <input
            className={classes.BoxFormInput}
            type="email"
            id="email"
            placeholder="Enter e-mail address"
            onChange={emailChangedHandler}
            onBlur={emailBlurHandler}
            defaultValue={employee.email}
          />
        </div>
        <div className={classes.BoxFormInputContainerPhone}>
          <label htmlFor="phone" className={classes.label}>
            Phone number
          </label>
          <PhoneInput
            country={"md"}
            value={phoneNumber}
            onChange={handleChange}
            countryCodeEditable={false}
            preferredCountries={preferedCountries}
            placeholder="Enter phone number"
            containerClass={classes.PhoneContainer}
            inputClass={classes.PhoneInput}
            dropdownClass={classes.PhoneDropDown}
            buttonClass={classes.PhoneButton}
            inputProps={{
              required: true,
            }}
          />
        </div>
        <button
          className={classes.TimeTable}
          onClick={() => setShowTimeTable(true)}
        >
          <span className={classes.TimeTableText}>View the timetable</span>
        </button>
      </div>
      <button
        className={classes.DeleteUserButton}
        onClick={() => handleDeleteUser(employee.id)}
      >
        Delete employee
      </button>
      <SaveChangesButton formIsValid={formIsValid} />
    </form>
  );
};

export default EditEmployeeDetails;


