import React from "react";
import classes from "./EditEmployeeVacation.module.css";

type Props = {
  vacation: any;
  onCheckboxChange: any;
  isChecked?: boolean;
};

function CheckboxComponent(props: Props) {
  // const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    // setIsChecked(!isChecked);
    props.onCheckboxChange(props.vacation);
  };

  return (
    <div className={classes.CheckboxContainer}>
      <label className={classes.CheckboxLabel}>
        <input
          type="checkbox"
          className={classes.HiddenCheckbox}
          onChange={handleCheckboxChange}
          checked={props.isChecked}
        />
        <div
          className={`${classes.Checkbox} ${
            props.isChecked ? classes.Checked : ""
          }`}
        >
          {props.isChecked && <div className={classes.Checkmark}>&#10003;</div>}
        </div>
      </label>
    </div>
  );
}

export default CheckboxComponent;
