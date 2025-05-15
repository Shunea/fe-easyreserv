export const reservationStyle = {
    container: (provided: any) => ({
      ...provided,
      width: "216px",
      fontSize: "15px",
      display:"flex",
      justifyContent:"space-between"      
    }),
    control: (provided: any, state: { isDisabled: any; isFocused: any }) => ({
      ...provided,
      cursor:"pointer",

      height: "52px",
      width:"100%",
      borderRadius: "12px",
      border: "none",
      paddingLeft: "29px",
      display:"flex",
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