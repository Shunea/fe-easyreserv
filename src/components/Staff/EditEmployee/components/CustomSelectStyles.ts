const customStyles = {
  dropdownIndicator: (provided: any) => ({
    ...provided,
    width: "40px",
    height: "40px",
    opacity: "0.35",
  }),

  indicatorContainer: (provided: any, state: any) => ({
    ...provided,
  }),

  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),

  control: (provided: any) => ({
    ...provided,
    display: "flex",
    height: "52px",
    padding: "0px 16px",
    alignItems: "center",
    gap: "8px",
    alignSelf: "stretch",
    borderRadius: "12px",
    border: "1px solid #EEE",
    background: "var(--brand-snow, #FFF)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#FE9800",
      borderWidth: "2px",
    },
  }),

  container: (provided: any, state: any) => ({
    ...provided,
    width: "100%",
  }),

  valueContainer: (provided: any) => ({
    ...provided,
    padding: "0px !important",
  }),

  input: (provided: any) => ({
    ...provided,
    overflow: "hidden",
    color: "#020202",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "Inter",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "100%",
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: "#020202",
    fontFamily: "Inter",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
  }),
};

export default customStyles;
