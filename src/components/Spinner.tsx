import React from "react";
import { BounceLoader, PulseLoader } from "react-spinners";
import classes from "./Spinner.module.css";

interface SpinnerProps {
  loading: boolean;
  type?: string;
  customClassName?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ loading, type ,customClassName }) => {
  return (
    <>
      {type === undefined ? (
        <div
          className={`${classes["spinner-container"]} ${
            customClassName ? customClassName : "" // Add the new class conditionally
          } ${
            !loading ? `${classes["spinner-container-hidden"]}` : ""
          }`}
        >
          <PulseLoader color={"#FE9800"} loading={loading} size={15} />
        </div>
      ) : (
        <div
          className={`${classes["spinner-container-modal"]} ${
            customClassName ? customClassName : "" // Add the new class conditionally
          } ${
            !loading ? `${classes["spinner-container-hidden"]}` : ""
          }`}
        >
          <BounceLoader color={"#FE9800"} loading={loading} size={50} />
        </div>
      )}
    </>
  );
};

export default Spinner;
