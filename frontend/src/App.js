import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import { LoginForm } from "./components/Forms";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider, getDesign } from "./provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "@mui/material";
import Dashboard from "./pages/Dashboard/index.js";
// import Chat from "./pages/Chat";
import { VerficationForm } from "./components/Forms";

export default function App() {
  const pages = [
    {
      path: "/",
      exact: true,
      element: <Home />,
    },
    {
      path: "/me/dashboard/*",
      exact: true,
      element: <Dashboard />,
    },
    {
      path: "/u/login",
      exact: true,
      element: <LoginForm />,
    },
    {
      path: "/u/verification",
      exact: true,
      element: <VerficationForm />,
    },
    // {
    //   path: "/chat",
    //   exact: true,
    //   element Chat,
    // },
  ];

  // globally set backgroundColor for all snackbar
  const [_mode, _setMode] = useState("light");

  const theme = createTheme(getDesign(_mode));
  const context = {
    setMode: (mode) => _setMode(mode),
  };

  return (
    <>
      <GlobalStyles
        styles={{
          html: {
            scrollBehavior: "smooth",
            overflowY: "scroll",
            scrollbarWidth: "none",
            // msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              // display: "none",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundcolor: "darkgrey",
              outline: "1px solid slategrey",
            },
            "@keyframes pro": {
              to: {
                transform: "scale(2)",
              },
              from: {
                transform: "scale(9)",
              },
            },
          },
          body: {
            fontFamily: "Meow Script, cursive",
          },
          "@keyframes glow": {
            "0%": {
              boxShadow: " 0 0 0 0px rgba(0, 0, 0, 0.1)",
              opacity: 1,
              transform: "scale3d(1,1,0.5)",
            },
            "50%": {
              boxShadow: " 0 0 0 0px rgba(0, 0, 0, 0.1)",
              opacity: 1,
              transform: "scale3d(1,1,0.5)",
            },
            "100%": {
              boxShadow: " 0 0 0 0px rgba(0, 0, 0, 0.1)",
              opacity: 1,
              transform: "scale3d(0,0,0)",
            },
          },
        }}
      />
      <CssBaseline />
      <Provider context={context}>
        <ThemeProvider theme={theme}>
          <Router>
            <Routes>
              {pages.map((page, i) => (
                <Route key={i} path={page.path} element={page.element} />
              ))}
              <Route path="*" element={<Home />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </Provider>
    </>
  );
}
