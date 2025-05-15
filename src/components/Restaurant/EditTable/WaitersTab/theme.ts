import { ThemeOptions, createTheme } from "@mui/material/styles";
import { ComponentsProps } from "@mui/material/styles/props";

const theme: ThemeOptions = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          flexDirection: "row-reverse",
          fontFamily: "Inter",
          fontSize: "16px",
          paddingRight: "0 !important",
        },
        input: {
          padding: "14.5px 9px !important",
          fontFamily: "Inter",
          fontSize: "16px",
          fontWeight: "600",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          border: 0,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          height: "48px",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: "Inter",
          left: "30px !important",
          color: "#020202 !important",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          opacity: "0.35",
          transform: "translate(14px, 16px) scale(1)",
          "&.MuiInputLabel-root.Mui-focused": {
            top: "0px",
            transform: "translate(18px, 0px) scale(0.75)",
          },
        },
        shrink: {
          transform: "translate(18px, 0px) scale(0.75)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          opacity: 0.35,
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          display: "flex",
          padding: "8px 12px 8px 8px",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          marginTop: "0",
          marginBottom: "0",
          maxHeight: "none",
        },
        switchViewButton: {
          display: "none",
        },
        label: {
          color: "#020202",
          fontFamily: "Inter",
          fontSize: "20px",
          fontStyle: "normal",
          fontWeight: "600",
          lineHeight: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        startIcon: { margin: 0 },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          position: "inherit",
        },
      },
    },
    MuiPickersCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: "#7f7c7c",
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          display: "flex",
          width: "48px",
          height: "48px",
          justifyContent: "center",
          alignItems: "center",
          margin: "0",
          color: "#020202",
          textAlign: "center",
          fontFamily: "Inter",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "600",
          lineHeight: "100%",
          position: "inherit !important",
          "&.MuiPickersDay-dayOutsideMonth": {
            opacity: 0.1,
          },
          "&.MuiPickersDay-root.Mui-selected": {
            backgroundColor: "#FE9800",
            borderRadius: "100px !important",
            opacity: "1 !important",
            fontWeight: "800",
            margin: "0 !important",
            width: "48px !important",
            height: "48px !important",
          },
          "&.MuiPickersDay-root.Mui-selected::after": {
            backgroundColor: "white !important",
          },
        },
        today: {
          backgroundColor: "#020202",
          borderRadius: "100px !important",
          color: "#FFF",
          fontWeight: "800",
          border: "none !important",
          width: "24px",
          height: "24px",
          margin: "12px 12px 12px 12px",
          opacity: "1 !important",
          "&::after": {
            backgroundColor: "#020202 !important",
            top: "90% !important",
          },
          "&:hover": {
            backgroundColor: "#FE9800",
          },
        },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
        },
        spacer: {
          width: "16px",
        },
        button: {
          display: "flex",
          width: "28px",
          height: "28px",
          padding: "6px 6px 6px 4px",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          borderRadius: "100px",
          border: "1px solid #EEE",
          background: "#F6F6F6",
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          maxHeight: "none",
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          width: "48px",
          height: "48px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: "0.5",
          margin: "0",
          color: "#020202",
          textAlign: "center",
          fontFamily: "Inter",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "500",
          lineHeight: "100%",
        },
        slideTransition: {
          // height: "310px",
        },
      },
    },
  },
} as ThemeOptions & { components?: ComponentsProps });

export default theme;
