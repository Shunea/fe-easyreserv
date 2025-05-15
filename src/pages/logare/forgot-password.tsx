import { useForm } from "react-hook-form";
import * as NewComponents from "./NewComponents";
import { useForgotPassword } from "src/hooks/queries/useForgotPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import mail from "../../assets/mail-is-on-the-way.svg";
import Image from "next/image";

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordData>();
  const { mutate, isLoading } = useForgotPassword();
  const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false); // State to control the message visibility

  const onSubmit = handleSubmit((data) => {
    if (!data.email) {
      toast.warning("Introduceti adresa de email!");
    } else {
      mutate(
        { ...data },
        {
          onError: (error) => {
            setTimeout(() => {
              error.response &&
              error.response.data &&
              !Array.isArray(error.response.data["message"])
                ? toast.error(error.response.data["message"])
                : toast.error(
                    "Ceva nu a mers bine, va rugam sa incercati din nou!"
                  );
            }, 100);
          },
          onSuccess: () => {
            setTimeout(() => {
              toast.success("Invitația a fost trimisă cu succes!");
              setShowCheckEmailMessage(true);
            }, 100);
          },
        }
      );
    }
  });

  return (
    <NewComponents.Container>
      <NewComponents.Form noValidate id="forgot-password" onSubmit={onSubmit}>
        {showCheckEmailMessage ? (
          <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <NewComponents.Title>Check your email</NewComponents.Title>
            <Image src={mail} alt="mail" width={45} height={45} />
          </div>
        ) : (
          <>
            <NewComponents.Title style={{ marginBottom: "24px" }}>
              Enter your e-mail
            </NewComponents.Title>
            <NewComponents.Input
              type="email"
              placeholder="E-mail"
              error={formState.errors["email"]}
              {...register("email", {
                required: "Acest câmp este obligatoriu",
              })}
            />
            <NewComponents.Button
              disabled={isLoading}
              type="submit"
              form="forgot-password"
              className="pointer"
            >
              Send E-mail
            </NewComponents.Button>
          </>
        )}
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

export default ForgotPassword;
