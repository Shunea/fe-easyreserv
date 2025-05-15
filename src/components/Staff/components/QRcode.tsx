import { useEffect, useRef, useState } from "react";
import { getQR } from "../../../auth/api/requests";
import { closeIcon } from "../../../icons/icons";
import OutsideClickHandler from "./OutsideClickHandler";
import classes from "./QRcode.module.css";

type Props = {
  setQrButton: any;
};
const QRcode = ({ setQrButton }: Props) => {
  const [qrCode, setQrCode] = useState();

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const response = await getQR();
        setQrCode(response);
      } catch (error) {
        console.error("Cant't get QR");
      }
    };
    fetchQr();
  }, []);

  const employeeBoxRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className={classes.EditEmployeeModal}>
      <div ref={employeeBoxRef} className={classes.QRBox}>
        <OutsideClickHandler
          innerRef={employeeBoxRef}
          onClose={() => setQrButton(false)}
        />
        <div className={classes.QRHead}>
          <label className={classes.QRHeading}>Staff scan</label>
          <button
            className={classes.QRCloseButton}
            onClick={() => setQrButton(false)}
          >
            {closeIcon}
          </button>
        </div>
        <div className={classes.QRContent}>
          <div className={classes.QRContainer}>
            <img
              src={`data:image/png;base64,${qrCode}`}
              alt="Staff QR"
              className={classes.QRCode}
            />
          </div>
        </div>
        <div className={classes.QRActions}>
          <button
            className={classes.QRCancel}
            onClick={() => setQrButton(false)}
          >
            <span className={classes.QRCancelText}>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default QRcode;
