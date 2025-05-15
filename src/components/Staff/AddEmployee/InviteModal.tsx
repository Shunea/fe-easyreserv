import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import useInput from "../../../hooks/use-input";
import { closeIcon } from "../../../icons/icons";
import styles from "./InviteModal.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createStaff, getAllDepartments, getAllUsers } from "src/auth/api/requests";
import CustomSelect from "../EditEmployee/components/CustomSelect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OutsideClickHandler from "../components/OutsideClickHandler";

type InviteModalProps = {
  onClose: () => void;
};

// Добавим интерфейс для роли
interface Role {
  value: string;
  label: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const isNotEmpty = (value: string) => value.trim() !== "";

  const {
    value: enteredFullName,
    isValid: enteredFullNameIsValid,
    valueChangeHandler: fullNameChangedHandler,
    inputBlurHandler: fullNameBlurHandler,
    reset: resetFullNameInput,
  } = useInput(isNotEmpty, "");

  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  
  const handleDepartmentChange = (selectedOption: any, event?: any) => {
    if (event?.action === 'clear') {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedDepartment(selectedOption);
  };

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value: string) => value.includes("@"), "");

  const [selectedRole, setSelectedRole] = useState<any>(null);
  const handleRoleChange = (selectedOption: any, event?: any) => {
    if (event?.action === 'clear') {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedRole(selectedOption);
  };

  const [roleOptions, setRoleOptions] = useState<Role[]>([
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
  ]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await getAllUsers();
        setRoleOptions(prevRoles => {
          const allRoles = [...prevRoles];
          (roles as Role[]).forEach(role => {
            if (!allRoles.some(r => r.value === role.value)) {
              allRoles.push(role);
            }
          });
          return allRoles;
        });
      } catch (error) {
        console.error("Error loading roles:", error);
      }
    };
    
    loadRoles();
  }, []);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(false);

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{10,14}$/;

    return phoneNumberPattern.test(phoneNumber);
  };

  const formIsValid =
    enteredFullNameIsValid &&
    selectedDepartment !== null &&
    enteredEmailIsValid &&
    valid &&
    selectedRole !== null;

  const success = () =>
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

  const resetPhone = () => {
    setPhoneNumber("");
    setValid(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      try {
        await createStaff({
          username: enteredFullName,
          role: selectedRole.value,
          department: selectedDepartment.value,
          email: enteredEmail,
          phoneNumber: `+${phoneNumber}`,
        });

        // Reset inputs
        resetFullNameInput();
        setSelectedDepartment(null);
        resetEmailInput();
        resetPhone();
        setSelectedRole(null);
        success();
        onClose();
      } catch (error) {
        console.error("Error submitting data", error);
      }
    }
  };

  const InviteModalRef = useRef<HTMLDivElement | null>(null);
  const preferedCountries = ["md", "ro", "ae", "il", "it", "si"];

  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departments = await getAllDepartments();
        console.log('Loaded departments:', departments); // Для отладки
        setDepartmentOptions(departments);
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    };
    
    loadDepartments();
  }, []);

  return (
    <>
      <Box className={styles.overlayInvite} />
      <Box 
        className={styles.InviteModalWindow} 
        ref={InviteModalRef}
        onMouseDown={(e) => {
          // Проверяем, является ли целевой элемент или его родители частью формы
          const isFormElement = e.target instanceof Element && (
            e.target.closest('input') || 
            e.target.closest('button') || 
            e.target.closest('.select__clear-indicator') ||
            e.target.closest('.PhoneInput')
          );

          if (!isFormElement) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        <OutsideClickHandler innerRef={InviteModalRef} onClose={onClose} />
        <div className={styles.headingInvite}>
          <p className={styles.headingInviteTitle}>Invite employee</p>
          <button className={styles.headingInviteCloseBtn} onClick={onClose}>
            {closeIcon}
          </button>
        </div>
        <form className={styles.formInvite} onSubmit={handleSubmit}>
          <div className={styles.formInviteInputContainer}>
            <label htmlFor="name" className={styles.label}>
              Full name
            </label>
            <input
              className={styles.formInviteInput}
              type="text"
              id="name"
              placeholder="Enter employee's name and surname"
              onChange={fullNameChangedHandler}
              onBlur={fullNameBlurHandler}
              value={enteredFullName}
            />
          </div>

          <div className={styles.formInviteSelect}>
            <CustomSelect
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              label="Department"
              options={departmentOptions}
              placeholder="Select the department"
            />
          </div>

          <div className={styles.formInviteSelect}>
            <CustomSelect
              value={selectedRole}
              onChange={handleRoleChange}
              label="Role"
              options={roleOptions}
              placeholder="Select the role"
            />
          </div>

          <div className={styles.formInviteInputContainer}>
            <label htmlFor="email" className={styles.label}>
              E-mail address
            </label>
            <input
              className={styles.formInviteInput}
              type="email"
              id="email"
              placeholder="Enter e-mail address"
              onChange={emailChangedHandler}
              onBlur={emailBlurHandler}
              value={enteredEmail}
            />
          </div>
          <div className={styles.formInviteInputContainer}>
            <label htmlFor="phone" className={styles.label}>
              Phone number
            </label>
            <PhoneInput
              country={"md"}
              value={phoneNumber}
              countryCodeEditable={false}
              preferredCountries={preferedCountries}
              onChange={handleChange}
              placeholder="Enter phone number"
              containerClass={styles.PhoneContainer}
              inputClass={styles.PhoneInput}
              dropdownClass={styles.PhoneDropDown}
              buttonClass={styles.PhoneButton}
              inputProps={{
                required: true,
              }}
            />
          </div>
          <div className={styles.InviteModalAction}>
            <Button
              className={styles.InviteModalSubmitButton}
              type="submit"
              variant="outlined"
              size="large"
              disabled={!formIsValid}
            >
              <Typography className={styles.InviteModalSubmitButtonTitle}>
                Send Invite
              </Typography>
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default InviteModal;
