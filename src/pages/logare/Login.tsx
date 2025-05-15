import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { LoginCredentialsDTO } from "../../auth/api/login";
import { useLogin } from "../../hooks/mutations/useLogin";
import {  useState } from "react";
import { AxiosError } from "axios";
import eyeOpen from "../../assets/eye-svgrepo-com-1.svg";
import eyeClosed from "../../assets/eye-off-svgrepo-com-1.svg";
import { Box } from "@mui/material";
import * as NewComponents from "./NewComponents";
import Profile from "../../assets/Profile.svg";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [signIn] = useState<boolean>(true);
  // const easyReservSolution = process.env.REACT_APP_MY_SITE_URL;

  const {
    register: registerLogin,
    handleSubmit,
    setError,
    formState,
  } = useForm<LoginCredentialsDTO>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isLoading } = useLogin();

  const onSubmit: SubmitHandler<LoginCredentialsDTO> = (data) => {
    mutate(data, {
      onError: (error: AxiosError) => {
        setError("password", {
          type: "manual",
          message: (error as any).response?.data.message,
        });
      },
    });
  };

  

  return (
      <NewComponents.SignInContainer signinIn={signIn}>
        <NewComponents.Form
          noValidate
          id="login"
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e);
          }}
        >
          <NewComponents.Title>Log into account</NewComponents.Title>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "32px 0",
            }}
          >
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
              placeholder="Enter e-mail address"
              {...registerLogin("email", {
                validate: (value) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (emailRegex.test(value)) {
                    return true;
                  } else {
                    return "Invalid email address";
                  }
                },
              })}
              id="email"
            />
            <label
              style={{
                display: "flex",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
              htmlFor="password"
            >
              Password
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <NewComponents.Input
                type={passwordShown ? "text" : "password"}
                placeholder="Enter password"
                {...registerLogin("password")}
                id="password"
              />
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
                onClick={() => setPasswordShown(!passwordShown)}
              >
                <Image
                  src={passwordShown ? eyeOpen : eyeClosed}
                  alt="eye"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            {formState.errors["password"] && (
              <div
                role="alert"
                aria-label={formState.errors["password"].message}
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginBottom: "25px",
                  marginTop: "-25px",
                }}
              >
                {formState.errors["password"].message}
              </div>
            )}
            <Box
              sx={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: "14px",
              }}
            >
              <div style={{ marginRight: "5px" }}>Forgot your password?</div>
              <a
                href="/forgot-password"
                style={{ color: "#000", fontWeight: "600" }}
              >
                Restore it
              </a>
            </Box>
          </div>
          <NewComponents.Button
            disabled={isLoading}
            type="submit"
            form="login"
            className="pointer"
          >
            <Image src={Profile} width={20} height={20} alt="profileIcon" />
            Log in
          </NewComponents.Button>
        </NewComponents.Form>
        <NewComponents.Footer>
          Don't have an account?
          <a href="https://easyreserv.io/pricing" style={{color: "#000", fontWeight: "600", textDecoration:"underline" }}>
            Create now
          </a>
        </NewComponents.Footer>
      </NewComponents.SignInContainer>
  );
};

export default Login;
