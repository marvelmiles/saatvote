import React from "react";
import PropTypes from "prop-types";
import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";

function Lead({ sx, chipSX, variant, label, ...rest }) {
  const thread = {
    width: "100px",
    maxWidth: "100%",
    // height: "20px",
    // borderRadius: "50%",
    position: "relative",
    backgroundColor: "#ffe",
    border: "2px solid red",
    // zIndex: 2,
    "&:before": {
      position: "absolute",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "primary.main",
      content: `'ddd'`,
      zIndex: 1,
      right: 0,
    },
  };
  const after = {
    "&::after": {
      posiiton: "absolute",
      width: "20px !important",
      height: "5px",
      background: "#333",
      content: `'dff'`,
      zIndex: 2,
      border: "2px solid red",
    },
  };

  const leadStyle = {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    width: "200px",
    maxWidth: "calc(100% - 30px)",
    margin: "10px auto",
    mt: "20px",
    position: "relative",
    border: "2px solid green",
    ...sx,
  };

  const glowStyle = {
    flexGrow: 1,
    alignSelf: "center",
    border: `1px solid purple`,
    position: "relative",
    borderRadius: "2px",
    "&::after": {
      position: "absolute",
      content: `""`,
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "primary.main",
      zIndex: 1,
    },
    "&::before": {
      position: "absolute",
      top: 0,
      right: 0,
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.9)",
        opacity: 1,
        background: "yellow !important",
      },
      "100%": {
        transform: "scale(1.8)",
        opacity: 0,
        background: "purple !important",
      },
    },
  };

  return (
    <>
      <Box sx={leadStyle}>
        <Box
          sx={{
            ...glowStyle,
            "&::before, &::after": {
              left: "-5px",
              top: "-5px",
            },
          }}
        ></Box>
        <Chip
          sx={{
            margin: "0",
            width: "auto",
            padding: "0 !important",
            fontWeight: "bold",
            ...chipSX,
          }}
          variant={variant || "outlined"}
          label={label}
          {...rest}
        />
        <Box
          sx={{
            ...glowStyle,
            "&::after, &::before": {
              right: "-5px",
              top: "-5px",
            },
          }}
        ></Box>
      </Box>
    </>
  );
}

Lead.propTypes = {};

export default Lead;

export const ChipLabel = ({
  sx,
  chipSX,
  variant,
  label,
  styl = {},
  ...rest
}) => {
  const thread = {
    width: "100px",
    maxWidth: "100%",
    // height: "20px",
    // borderRadius: "50%",
    position: "relative",
    backgroundColor: "#ffe",
    border: "2px solid red",
    // zIndex: 2,
    "&:before": {
      position: "absolute",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "primary.main",
      content: `'ddd'`,
      zIndex: 1,
      right: 0,
    },
  };
  const after = {
    "&::after": {
      posiiton: "absolute",
      width: "20px !important",
      height: "5px",
      background: "#333",
      content: `'dff'`,
      zIndex: 2,
      border: "2px solid red",
    },
  };

  const leadStyle = {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    width: "200px",
    maxWidth: "calc(100% - 30px)",
    margin: "10px auto",
    mt: "20px",
    position: "relative",
    border: "2px solid green",
  };

  const glowStyle = {
    flexGrow: 1,
    alignSelf: "center",
    border: `1px solid purple`,
    position: "relative",
    borderRadius: "2px",
    "&::after": {
      position: "absolute",
      content: `""`,
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "primary.main",
      zIndex: 1,
    },
    "&::before": {
      position: "absolute",
      top: 0,
      right: 0,
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.9)",
        opacity: 1,
        background: "yellow !important",
      },
      "100%": {
        transform: "scale(1.8)",
        opacity: 0,
        background: "purple !important",
      },
    },
  };

  return (
    <>
      <Box sx={leadStyle}>
        <Box
          sx={{
            ...glowStyle,
            "&::before, &::after": {
              left: "-5px",
              top: "-5px",
            },
          }}
        ></Box>
        <Chip
          sx={{
            margin: "0",
            width: " calc(100% - 40px)",
            padding: "0 !important",
            fontWeight: "bold",
          }}
          variant={variant || "outlined"}
          label={label}
          {...rest}
        />
        <Box
          sx={{
            ...glowStyle,
            "&::after, &::before": {
              right: "-5px",
              top: "-5px",
            },
          }}
        ></Box>
      </Box>
    </>
  );
};

export const HRLabel = (props) => {
  return (
    <>
      <Typography variant="h4" sx={{ my: 1 }}>
        {props.label}
        <Box
          variant="hr"
          sx={{
            width: "50px",
            height: "5px",
            borderRadius: "25px",
            backgroundColor: "primary.main",
            mt: "5px",
          }}
        />
      </Typography>
    </>
  );
};
