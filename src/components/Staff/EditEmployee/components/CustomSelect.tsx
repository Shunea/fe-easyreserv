import React from "react";
import Select, { components } from "react-select";
import CreatableSelect from 'react-select/creatable';
import { CustomDropDownIcon } from "../../../../icons/icons";
import styles from "../../AddEmployee/InviteModal.module.css";
import CustomSelectStyles from "../components/CustomSelectStyles";

const DropdownIndicator: React.FC<any> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      {CustomDropDownIcon}
    </components.DropdownIndicator>
  );
};

type CustomSelectProps = {
  label?: string;
  id?: string;
  name?: string;
  onChange: (selectedOption: any) => void;
  onBlur?: () => void;
  value: any;
  placeholder?: any;
  disabled?: boolean;
  options: any[];
  maxMenuHeight?: number;
  styles?: any;
  defaultValue?: any;
};

const CustomSelect: React.FC<CustomSelectProps> = (props) => {
  const customStyles = {
    ...CustomSelectStyles,
    ...props.styles,
  };

  const handleChange = (selectedOption: any) => {
    props.onChange(selectedOption);
  };

  const selectedOption = props.options.find(
    (option) => option.value === props.value
  );

  return (
    <>
      <div className={styles.customSelect}>
        {props.label && (
          <p id={props.id} className={styles.label}>
            {props.label}
          </p>
        )}
        <CreatableSelect
          name={props.name}
          styles={customStyles}
          onChange={handleChange}
          onBlur={props.onBlur}
          value={selectedOption}
          placeholder={props.placeholder}
          isDisabled={props.disabled}
          options={props.options}
          maxMenuHeight={props.maxMenuHeight}
          components={{ DropdownIndicator }}
          isClearable
          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        />
      </div>
    </>
  );
};

export default CustomSelect;
