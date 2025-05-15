export const defaultStyle = {
  container: (provided: any) => ({
    ...provided,
    width: "100%",
    fontSize: "15px",
  }),
  control: (provided: any, state: { isDisabled: any; isFocused: any }) => ({
    ...provided,
    height: "40px",
    borderRadius: "12px",
    border: "none",
    paddingLeft: "7px",
    backgroundColor: state.isDisabled ? "#fcfcfc" : "transparent",
    outline: state.isFocused
      ? "1px solid rgba(254, 152, 0, 0.4);"
      : "1px solid #eeeeee",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {
      outline: "1px solid rgba(254, 152, 0, 0.4)",
    },
  }),
  placeholder: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,0.4)",
    textAlign: "left",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
  menuList: (provided: any) => ({
    ...provided,
    height: "160px",
  }),
};
export const contactsStyle = {
  container: (provided: any) => ({
    ...provided,
    // width: "100%",
    fontSize: "15px",
    marginBottom: "25px",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    marginLeft: "28px",
  }),
  input: (provided: any) => ({
    ...provided,
    padding: "0 !important",
  }),
  control: (provided: any, state: { isDisabled: any; isFocused: any }) => ({
    ...provided,
    height: "40px",
    borderRadius: "12px",
    border: "none",
    // paddingLeft: "7px",
    backgroundColor: state.isDisabled ? "#fcfcfc" : "transparent",
    outline: state.isFocused
      ? "1px solid rgba(254, 152, 0, 0.4);"
      : "1px solid #eeeeee",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {
      outline: "1px solid rgba(254, 152, 0, 0.4)",
    },
  }),
  placeholder: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,0.4)",
    textAlign: "left",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
};
export const scheduleStyle = {
  container: (provided: any) => ({
    ...provided,
    width: "100%",
    fontSize: "15px",
  }),
  control: (provided: any, state: { isDisabled: any; isFocused: any }) => ({
    ...provided,
    height: "40px",
    borderRadius: "0px",
    border: "none",
    paddingLeft: "7px",
    backgroundColor: state.isDisabled ? "#fcfcfc" : "transparent",
    outline: state.isFocused
      ? "1px solid rgba(254, 152, 0, 0.4);"
      : "1px solid #eeeeee",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {
      outline: "1px solid rgba(254, 152, 0, 0.4)",
    },
  }),
  menuList: (provided: any) => ({
    ...provided,
    length: "20px",
  }),
  placeholder: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,0.4)",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
};
export const scheduleCornerStyle = {
  container: (provided: any) => ({
    ...provided,
    width: "100%",
    fontSize: "15px",
  }),
  control: (
    provided: { [x: string]: any },
    state: { isDisabled: any; isFocused: any }
  ) => ({
    ...provided,
    height: "40px",
    borderRadius: "0 12px 0 0 ",
    border: "none",
    paddingLeft: "7px",
    backgroundColor: state.isDisabled ? "#fcfcfc" : "transparent",
    outline: state.isFocused
      ? "1px solid rgba(254, 152, 0, 0.4);"
      : "1px solid #eeeeee",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {
      outline: "1px solid rgba(254, 152, 0, 0.4)",
    },
    "@media only screen and (max-width: 990px)": {
      ...provided["@media only screen and (max-width: 990px)"],
      borderRadius: "0",
    },
  }),
  placeholder: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,0.4)",
  }),
  DownChevron: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,1)",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
};
export const ingredients_select_style = {
  container: (provided: any) => ({
    ...provided,
    width: "100%",
    fontSize: "15px",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "0px",
  }),
  control: (provided: any, state: { isDisabled: any; isFocused: any }) => ({
    ...provided,
    height: "40px",
    border: "none",
    padding: "0px",
    backgroundColor: state.isDisabled ? "#fcfcfc" : "transparent",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {
      outline: "1px solid rgba(254, 152, 0, 0.4)",
    },
  }),
  placeholder: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,0.4)",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
};

export const setupStyle = {
  container: (provided: any) => ({
    ...provided,
    // paddingRight: '0',
    maxWidth: "87px",
    margin: 0,
    marginLeft: "-19px",
    fontSize: "15px",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    width: "4px",
    // maxWidth: '300px'
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    paddingRight: "0",
    textAlign: "end",
    // maxWidth: '300px'
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    height: "40px",
    border: "none",
    paddingLeft: "7px",
    backgroundColor: state.isDisabled ? "transparent" : "transparent",
    outline: "none",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {},
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,1)",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: "3",
  }),
  menuList: (provided: any) => ({
    ...provided,
    zIndex: "3",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
};

export const reservationStyle = {
  container: (provided: any) => ({
    ...provided,
    width: "100%",
    maxWidth: "200px",
    fontSize: "15px",
  }),
  control: (provided: any, state: { isDisabled: any; isFocused: any }) => ({
    ...provided,
    height: "40px",
    borderRadius: "12px",
    border: "none",
    paddingLeft: "29px",
    backgroundColor: state.isDisabled ? "#fcfcfc" : "transparent",
    outline: state.isFocused
      ? "1px solid rgba(254, 152, 0, 0.4);"
      : "1px solid #eeeeee",
    boxShadow: state.isFocused ? "none" : "initial",
    ":hover": {
      outline: "1px solid rgba(254, 152, 0, 0.4)",
    },
  }),
  placeholder: (provided: any, state: { isDisabled: any }) => ({
    ...provided,
    color: state.isDisabled ? "rgba(2,2,2,0.2)" : "rgba(2,2,2,0.4)",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: "#000",
    backgroundColor: state.isSelected ? "rgba(254, 152, 0, 0.2)" : "white",
    ":hover": {
      backgroundColor: "#eeeeee",
    },
  }),
};
