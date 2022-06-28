import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
// Awkward way of handling animation with react
function Wave({ styles = {}, pause = false }) {
  pause = !pause;
  return (
    <Box
      sx={{
        ...container,
        ...styles.container,
        animationPlayState: pause ? "running" : "paused",
      }}
    >
      <Box
        sx={{
          ...stroke,
          animationDelay: "0s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.3s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.6s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.9s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.3s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.6s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.9s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.3s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.6s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
      <Box
        sx={{
          ...stroke,
          animationDelay: "0.9s",
          animationPlayState: pause ? "running" : "paused",
        }}
      ></Box>
    </Box>
  );
}

const container = {
  position: "relative",
  width: "100%",
  minWidth: 0,
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const stroke = {
  position: "relative",
  background: "green",
  height: "100%",
  width: "5px",
  borderRadius: "50px",
  margin: "0 10px",
  "&::before": {
    position: "absolute",
    content: `""`,
    width: "inherit",
    height: "inherit",
    backgroundColor: "red",
    right: "-10px",
    margin: "5px 0",
    borderRadius: "inherit",
  },
  "&::after": {
    position: "absolute",
    content: `""`,
    width: "inherit",
    height: "inherit",
    backgroundColor: "purple",
    left: "-5px",
    margin: "10px 0px",
    borderRadius: "inherit",
  },
  animation: "animate-wave 1.2s linear infinite",
  "@keyframes animate-wave": {
    "50%": {
      height: "20%",
    },
    "100%": {
      height: "100%",
    },
  },
};

Wave.propTypes = {};

export default Wave;
