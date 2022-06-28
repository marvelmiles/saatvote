import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

function StatBox({ stat, label }) {
  if (!label) return null;
  return (
    <>
      <Box
        sx={{
          p: 2,
          m: 1,
          //   border: (theme) => `3px solid ${theme.palette.primary.main}`,
          borderRadius: 1,
          boxShadow: 5,
          color: "primary.main",
        }}
      >
        <Typography
          align="center"
          variant="h3"
          component="h3"
          sx={{
            fontWeight: "bold",
            my: 2,
          }}
        >
          {stat || 0}
        </Typography>
        <Typography
          align="center"
          variant="h3"
          component="h3"
          sx={{
            fontWeight: "bold",
          }}
        >
          {label}
        </Typography>
      </Box>
    </>
  );
}

StatBox.propTypes = {};

export default StatBox;
