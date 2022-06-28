import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";

function StatBox(props) {
  return (
    <Box
      sx={{
        border: (theme) => `1px solid ${theme.palette.primary.main}`,
        color: "primary.main",
        p: 1,
        textAlign: "center",
        m: 2,
        borderRadius: 2,
      }}
    >
      {props.title ? (
        <Typography
          variant="h3"
          component="h3"
          sx={{ my: 1, fontWeight: "bold" }}
        >
          {props.title}
        </Typography>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100px"
          height="60px"
          sx={{ my: 1 }}
        />
      )}
      {props.stat !== undefined ? (
        <Typography variant="h2" sx={{ my: 1 }}>
          {props.stat}
        </Typography>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100px"
          height="60px"
          sx={{ my: 1 }}
        />
      )}
    </Box>
  );
}

StatBox.propTypes = {};

export default StatBox;
