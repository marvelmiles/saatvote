import { createContext, useContext as useCtx, useRef } from "react";
import { amber, grey } from "@mui/material/colors";
import SansCondensed from "./assets/fonts/Meow_Script/MeowScript-Regular.ttf";
import { io } from "socket.io-client";
import { BACKEND_URL } from "./config";
import { createTheme } from "@mui/material/styles";
const primary = "#45678d"; //"#1976d2";
const secondary = "#1976d2"; // #9e9e9e
const { shadows, palette } = createTheme();
export const getDesign = (mode, family) => {
  console.log(mode, "mode");
  return {
    shadows: [...shadows, "0 0 5px 5px #9e9e9e"],
    palette: {
      ...palette,
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
        sm: 567,
        md: 768,
        lg: 1200,
        xl: 1436,
        s200: 200,

        s768: 768,
        s300: 300,
        s400: 400,

        s480: 480,
        s567: 567,
        s640: 640,
        s600: 600,
        //use
        s220: 220,
        s280: 280,
        s320: 320,
        s360: 360,
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
      width: "45px !important",
      height: "45px !important",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "all .2223s ease-in-out",

      "&:hover": {
        boxShadow: (theme) =>
          `0px 0px 5px ${theme.palette.primary.light} !important`,
      },
    },
    borderColor: "#ced4da",
    mixins: {},
    typography: {
      fontFamily: "Meow Script, cursive",
    },
    components: {
      InputBase: {
        styleOverrides: {
          width: "100%",
        },
      },

      MuiButton: {
        variants: [
          {
            props: { variant: "contained" },
            style: {
              width: "100%",
            },
          },
        ],
        // styleOverrides: {
        //   root: {
        //     "&:hover": {
        //       backgroundColor: mode === "light" ? primary : "#333",
        //     },
        //   },
        // },
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
              width: "45px",
              height: "45px",
              border: `2px solid ${primary}`,
              color: primary,
              marginLeft: 5,
              marginRight: 5,
              background: "#467eac", //"red", //"#467eac", //"#648dae", //"#467eac", //"#1769aa", //"#2e73ab"
              // padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "& > svg": {
                fontSize: "3rem",
                color: "#fff",
                cursor: "inherit",
                alignSelf: "center",
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
  let socket = useRef(
    io(BACKEND_URL, {
      path: "/socketio-client/saat-vote",
      auth: {
        token: process.env.REACT_APP_SOCKETIO_ACCESS_TOKEN,
      },
    })
  );
  socket = socket.current;

  const _context = {
    socket,
  };

  return (
    <ctx.Provider value={{ ..._context, ...context }}>{children}</ctx.Provider>
  );
};

export const useContext = () => useCtx(ctx);
