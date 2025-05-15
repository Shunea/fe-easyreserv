import ReactSelect from "react-select"; //no creatable
import classes from "./Select.module.css";

const SimpleSelect = (props: {
  name?: string;
  styles?: any;
  label?: string;
  id?: any;
  onChange?: any;
  value?: string | { label: string; value: string };
  placeholder?: string;
  onBlur?: any;
  disabled?: boolean;
  maxMenuHeight?: number;
  options?: Array<{ label: string; value: string }>;
  onInputChange?: any;
  components?: any;
}) => {
  return (
    <>
      {props.label && (
        <p id={props.id} className={classes.label}>
          {props.label}
        </p>
      )}
      <ReactSelect
        required
        name={props.name}
        styles={props.styles}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        placeholder={props.placeholder}
        isDisabled={props.disabled}
        options={props.options}
        maxMenuHeight={props.maxMenuHeight}
        onInputChange={props.onInputChange}
        components={props.components}
      />
    </>
  );
};
export default SimpleSelect;
