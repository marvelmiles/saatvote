import { createContext, useContext as useCtx, useRef } from "react";
import { amber, grey } from "@mui/material/colors";
import SansCondensed from "./assets/fonts/Meow_Script/MeowScript-Regular.ttf";
import { io } from "socket.io-client";
import { CONSTANTS, socketIoOptions } from "./config";
import { createTheme } from "@mui/material/styles";
const primary = "#45678d"; //"#1976d2";
const secondary = "#1976d2"; // #9e9e9e
const { shadows } = createTheme();
export const getDesign = (mode, family) => {
  console.log(mode, "mode");
  return {
    shadows: [...shadows, "0 0 5px 5px #9e9e9e"],
    palette: {
      mode,
      primary: {
        main: primary,
        light: "#fff ", //"#412a5f5",
        // greyLight: "#FAFAFA",
        lightGrey: "#FAFAFA",
        dark: "#1565c0",
        greyLight: "#9e9e9e",
        purple: "#ab47bc",
        borderColor: "#ced4da",
        ...amber,
        ...(mode === "dark" && {
          main: amber[300],
        }),
      },
      secondary: {
        main: "#648dae", //"#648dae", //"#467eac", //"#1769aa", //"#2e73ab",
      },
      ...(mode === "dark" && {
        background: {
          default: primary,
          paper: primary,
        },
      }),
      text: {
        ...(mode === "light"
          ? {
              primary,
              secondary: grey[800],
              light: "#fff",
            }
          : {
              primary: "#fff",
              secondary: grey[500],
            }),
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        s768: 768,
        s280: 280,
        s300: 300,
        s480: 480,
        s567: 567,
        s640: 640,
      },
    },
    hr: {
      width: "50px",
      height: "5px",
      borderRadius: "25px",
      backgroundColor: mode === "light" ? primary : secondary,
      mx: "auto",
      mt: "5px",
    },
    socialsStyle: {
      boxShadow: "0px 0px 5px rgba(0,0,0,0.32)",
      fontSize: "20px",
      padding: "10px",
      borderRadius: "50%",
      width: "35px",
      height: "35px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "all .2223s ease-in-out",
      "&:hover": {
        boxShadow: (theme) =>
          `0px 0px 5px ${theme.palette.primary.light} !important`,
      },
      border: "2px solid red",
    },
    borderColor: "#ced4da",
    mixins: {},
    typography: {
      fontFamily: "Meow Script, cursive",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "light" ? primary : "#333",
            },
          },
        },
      },
      MuiAvatar: {
        variants: [
          {
            props: { variant: "avatar" },
            style: {
              border: `2px solid ${primary} !important`,
            },
          },
        ],
      },
      MuiBox: {
        variants: [
          {
            props: { variant: "flex-center" },
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid red",
            },
          },
        ],
      },
      MuiTYpography: {
        variants: [
          {
            props: { variant: "link" },
            style: {
              textDecoration: "underline",
              color: "primary.main",
              fontFamily: "Meow Script, cursive",
              cursor: "pointer",
            },
          },
        ],
      },
      MuiIconButton: {
        variants: [
          {
            props: { variant: "icon" },
            style: {
              width: "35px",
              height: "35px",
              border: `2px solid ${primary}`,
              color: primary,
              marginLeft: 2,
              marginRight: 2,
              background: "#467eac", //"red", //"#467eac", //"#648dae", //"#467eac", //"#1769aa", //"#2e73ab"
              // padding: "5px",

              "& > svg": {
                fontSize: "2rem",
                color: "#fff",
                cursor: "inherit",
              },
            },
          },
        ],
      },
      MuiCssBaseline: {
        styleOverrides: {
          "@font-face": {
            "font-family": "Open Sans Condensed, sans-serif",
            "font-display": "swap",
            "font-weight": 300,
            "font-style": "italic",
            src: `url(${SansCondensed})`,
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          fontFamily: "Meow Script, cursive",
        },
      },
    },
  };
};

export const ctx = createContext();

export const Provider = ({ children, context = {} }) => {
  const socketRef = useRef(io(CONSTANTS.BACKEND_URL, socketIoOptions));
  let socket = socketRef.current;

  const _context = {
    socket,
  };

  return (
    <ctx.Provider value={{ ..._context, ...context }}>{children}</ctx.Provider>
  );
};

export const useContext = () => useCtx(ctx);
