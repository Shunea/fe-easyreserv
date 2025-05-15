import Image from "next/image";
import { useState } from "react";
import * as NewComponents from "../../../pages/logare/NewComponents";
import classes from "./helpSupport.module.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { useForm } from "react-hook-form";
import api from "../../../auth/api/apiInstance";
import { getHelp } from "src/auth/api/requests";


type helpData = {
  title?: string;
  message?: string;
  module?: string;
};

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const { register, handleSubmit } = useForm();
  const [selectedModule, setSelectedModule] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const moduleOptions = [
    { value: "module1", label: "Module 1" },
    { value: "module2", label: "Module 2" },
  ];

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      height: "52px",
      width: "332px",
      padding: "0px 16px 0 5px",
      gap: "8px",
      borderRadius: "12px",
      marginBottom: "24px",
      border: "1px solid #eee",
      background: "#fff",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontSize: "16px",
      opacity: "0.7",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    menu: (provided: any) => ({
      ...provided,
      position: "absolute",
      top: "45px",
      // position: "relative",
      // top: "-20px",
      padding: "0 5px",
      borderRadius: "12px",
    }),
  };
  const onSubmit = async (data: helpData) => {
    if (!selectedModule) {
      toast.error("Please select a module");
      return;
    }

    try {
      const formData: helpData = {
        ...data,
        module: selectedModule.value,
      };
      const response = await getHelp(formData);
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className={classes.container}>
      <NewComponents.SignUpContainer style={{ width: "auto" }}>
        <NewComponents.Form
          noValidate
          id="help"
          onSubmit={handleSubmit(onSubmit)}
          style={{ padding: "24px" }}
        >
          <NewComponents.Title
            style={{ width: "auto", fontSize: "26px", marginBottom: "20px" }}
          >
            Create new Ticket
          </NewComponents.Title>
          <div style={{ display: "flex", flexDirection: "row", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  display: "flex",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                }}
                htmlFor="Title"
              >
                Title
              </label>
              <NewComponents.Input
                style={{ width: "332px" }}
                type="text"
                placeholder="Problema"
                {...register("title")}
                id="Title"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  display: "flex",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                }}
                htmlFor="module"
              >
                Select Module
              </label>
              <Select
                styles={customStyles}
                options={moduleOptions}
                placeholder="What kind of problem?"
                value={selectedModule}
                onChange={(selectedOption: any) =>
                  setSelectedModule(selectedOption)
                }
              />
            </div>
          </div>
          <label
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            placeholder="Enter additional comments"
            {...register("message")}
            id="message"
            rows={5} // Set the number of visible text lines
            className={classes.textarea}
          />

          <NewComponents.Button
            type="submit"
            form="help"
            className="pointer"
            style={{ width: "687px" }}
          >
            Send message to support
          </NewComponents.Button>
        </NewComponents.Form>
      </NewComponents.SignUpContainer>
      <ToastContainer
        position="top-right"
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
};

export default Register;
