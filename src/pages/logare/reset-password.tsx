import { useForm } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import eyeOpen from "../../assets/eye-svgrepo-com-1.svg";
import eyeClosed from "../../assets/eye-off-svgrepo-com-1.svg";
import * as NewComponents from "./NewComponents";
import { useResetPassword } from "src/hooks/mutations/useResetPassword";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "../../assets/Profile.svg";

type ResetCredentialsDTO = {
  password: string;
  confirmPassword: string;
};

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const { tokenKey } = useParams<{ tokenKey: string }>();

  const { register, handleSubmit, watch, formState } =
    useForm<ResetCredentialsDTO>({
      mode: "onChange",
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });
  const { mutate, isLoading } = useResetPassword();

  const onSubmit = (data: ResetCredentialsDTO) => {
    mutate(
      { tokenKey: tokenKey as string, password: data.password },
      {
        onError: (error) => {
          setTimeout(() => {
            if (
              error.response &&
              error.response.data &&
              !Array.isArray(error.response.data["message"])
            )
              toast.error(error.response.data["message"]);
          }, 100);
        },
        onSuccess: () => {
          setTimeout(() => {
            toast.success("Ati schimbat parola cu succes");
          }, 100);
        },
      }
    );
  };
  return (
    <NewComponents.Container>
      <NewComponents.Form
        noValidate
        id="reset-password"
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
      >
        <NewComponents.Title style={{ marginBottom: "24px" }}>
          Enter new password
        </NewComponents.Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <NewComponents.Input
            type={passwordShown ? "text" : "password"}
            placeholder="password"
            error={formState.errors["password"]}
            {...register("password", {
              validate: (value) => {
                if (value.length >= 6) {
                  return true;
                } else {
                  return "Parola trebuie să aibă cel puțin 6 caractere";
                }
              },
            })}
          />
          {formState.errors["password"] && (
            <div
              role="alert"
              aria-label={formState.errors["password"].message}
              style={{
                color: "#fff",
                fontSize: "15px",
              }}
            >
              {formState.errors["password"].message}
            </div>
          )}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <NewComponents.Input
            type={confirmPasswordShown ? "text" : "password"}
            placeholder="confirm password"
            {...register("confirmPassword", {
              required: "Acest câmp este obligatoriu",
              validate: (value) => {
                if (value === watch("password")) {
                  return true;
                } else {
                  return "Parolele nu se potrivesc";
                }
              },
            })}
          />
          {formState.errors["confirmPassword"] && (
            <div
              role="alert"
              aria-label={formState.errors["confirmPassword"].message}
              style={{
                color: "#fff",
                fontSize: "15px",
              }}
            >
              {formState.errors["confirmPassword"].message}
            </div>
          )}
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
        <NewComponents.Button
          disabled={isLoading}
          type="submit"
          form="reset-password"
          className="pointer"
        >
          <Image src={Profile} width={20} height={20} alt="profileIcon" />
          Change
        </NewComponents.Button>
      </NewComponents.Form>
      <ToastContainer
        position="top-right"
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </NewComponents.Container>
  );
};

export default ResetPassword;
