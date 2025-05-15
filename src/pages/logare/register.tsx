import Image from "next/image";
import { useState } from "react";
import eyeOpen from "../../assets/eye-svgrepo-com-1.svg";
import eyeClosed from "../../assets/eye-off-svgrepo-com-1.svg";
import * as NewComponents from "./NewComponents";
import { registerUser } from "src/auth/api/requests";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { PlanBody } from "src/auth/types";
import PasswordStrengthBar from "react-password-strength-bar";
import Profile from "../../assets/Profile.svg";
import styles from "./register.module.css";

type userData = {
  username?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  isSuperAdmin?: boolean;
  planId?: PlanBody;
};

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [registerPasswordShown, setRegisterPasswordShown] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [register, setRegister] = useState<userData[]>([]);
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get("planId");

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };
  const placeholder = "Enter phone number";

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_]).{8,}$/;

    // const passwordRegex =
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\s]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&#_), and have a minimum length of 8 characters."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userData = {
        email,
        password,
        phoneNumber: `+${phoneNumber}`,
        username,
        isSuperAdmin: !!planId,
        planId,
      };
      const data = await registerUser(userData);
      setRegister(data);
      toast.success("Invitatia a fost trimisa cu succes");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error registering user:", error);
      setTimeout(() => {
        window.location.href = "https://easyreserv.io/contact";
      }, 2000);
      // toast.error("Ceva nu a mers bine, va rugam sa incercati din nou!");
    }
  };
  const preferedCountries = ["md", "ro", "ae", "il", "it", "si"];

  return (
    <>
      <NewComponents.SignUpContainer>
        <NewComponents.Form noValidate id="signup" onSubmit={handleRegister}>
          <NewComponents.Title
            style={{ width: "auto", fontSize: "26px", marginBottom: "20px" }}
          >
            Create {planId ? "a business owner" : "a user"} account
          </NewComponents.Title>
          <label
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
            htmlFor="Name"
          >
            Name
          </label>
          <NewComponents.Input
            type="text"
            placeholder="Name"
            value={username}
            onChange={handleUsernameChange}
            id="Name"
          />
          <label
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
            htmlFor="email"
          >
            E-mail address
          </label>
          <NewComponents.Input
            type="email"
            placeholder="email"
            value={email}
            onChange={handleEmailChange}
            id="email"
          />
          {emailError && (
            <p style={{ color: "red", fontSize: "12px", marginBottom: "12px" }}>
              {emailError}
            </p>
          )}
          <label
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
            htmlFor="phoneNumber"
          >
            Phone number
          </label>
          <PhoneInput
              country={"md"}
              countryCodeEditable={false}
              placeholder="Enter phone number"
              containerClass={styles.PhoneContainer}
              inputClass={styles.PhoneInput}
              dropdownClass={styles.PhoneDropDown}
              value={phoneNumber}
              preferredCountries={preferedCountries}
              onChange={handleChange}
              buttonClass={styles.PhoneButton}
              inputProps={{
                required: true,
              }}
            />
          {!valid && (
            <p style={{ fontSize: "12px", marginBottom: "5px" }}>
              Please enter a valid phone number.
            </p>
          )}
          <label
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
            htmlFor="Password"
          >
            Password
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
              marginBottom: "32px",
            }}
          >
            <NewComponents.Input
              type={registerPasswordShown ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              id="Password"
            />
            <div style={{ width: "400px" }}>
              <PasswordStrengthBar password={password} />
            </div>
            <button
              type="button"
              style={{
                width: "23px",
                height: "23px",
                background: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "12px",
                right: "15px",
              }}
              onClick={() => setRegisterPasswordShown(!registerPasswordShown)}
            >
              <Image
                src={registerPasswordShown ? eyeOpen : eyeClosed}
                alt="eye"
                width={20}
                height={20}
              />
            </button>
          </div>
          {passwordError && (
            <p
              style={{
                marginTop: "-30px",
                color: "red",
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              {passwordError}
            </p>
          )}
          <NewComponents.Button type="submit" form="signup" className="pointer">
            <Image src={Profile} width={20} height={20} alt="profileIcon" />
            Create account
          </NewComponents.Button>
        </NewComponents.Form>
        <NewComponents.Footer>
          Already have an account?
          <a href="/login" style={{ color: "#000", fontWeight: "600" }}>
            Log in now
          </a>
        </NewComponents.Footer>
      </NewComponents.SignUpContainer>
      <ToastContainer
        position="top-right"
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
};

export default Register;
