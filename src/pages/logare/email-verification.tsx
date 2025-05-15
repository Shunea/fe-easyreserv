import { useEffect, useState } from "react";
import * as NewComponents from "./NewComponents";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEmailVerification } from "src/hooks/queries/useEmailVerification";
import celebrateEmogi from "../../assets/Celebration-Emoji-PNG-Image.png";
import sadEmogi from "../../assets/facebook-reaction-sad.svg";
import Image from "next/image";

interface EmailVerificationProps {}

const EmailVerification: React.FC<EmailVerificationProps> = () => {
  const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);

  const { tokenKey } = useParams<{ tokenKey: string }>();
  const navigate = useNavigate();
  const { mutate, isLoading } = useEmailVerification();

  useEffect(() => {
    mutate(
      { tokenKey: tokenKey as string },
      {
        onError: (error) => {
          setTimeout(() => {
            if (
              error.response &&
              error.response.data &&
              !Array.isArray(error.response.data["message"])
            )
              toast.error(error.response.data["message"]);
            setShowCheckEmailMessage(false);
            navigate("/login");
          }, 100);
        },
        onSuccess: () => {
          setTimeout(() => {
            toast.success("Felicitari ati confirmat email-ul cu succes");
            setShowCheckEmailMessage(true);
          }, 0);
        },
      }
    );
  }, []);

  return (
    <NewComponents.Container style={{ padding: "32px 40px" }}>
      <NewComponents.Title style={{ fontSize: "35px" }}>
        Email confirmation
      </NewComponents.Title>
      {!isLoading ? (
        <>
          {showCheckEmailMessage === true ? (
            <>
              <NewComponents.Title
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  margin: "24px 0",
                  fontSize: "20px",
                }}
              >
                Congratulations! your email was confirmed
              </NewComponents.Title>
              <img src={celebrateEmogi} width={50} height={50} alt="succes"/>
            </>
          ) : (
            <>
              <NewComponents.Title
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  margin: "24px 0",
                  fontSize: "20px",
                }}
              >
                We're sorry, but it seems there was an issue with confirming
                your email address.
              </NewComponents.Title>
              <Image src={sadEmogi} width={50} height={50} alt="succes" />
            </>
          )}
        </>
      ) : null}
      <NewComponents.Button
        type="submit"
        className="pointer"
        style={{
          marginTop: "24px",
        }}
      >
        <Link to="/login" style={{ textDecoration: "none", color: "#fff" }}>
          Go to Login
        </Link>
      </NewComponents.Button>
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

export default EmailVerification;
