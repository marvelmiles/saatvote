import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";
import Lead from "./Lead";
import { Box } from "@mui/system";

function Poll({ sx }) {
  const [stats, setStats] = useState([
    { statistic: 100, title: "Total vote" },
    {
      statistic: 280,
      title: "Nominees",
    },
    { statistic: 500, title: "Categories" },
    { statistic: 100, title: "Executives" },
  ]);
  return (
    <>
      <Box sx={{ py: 1, ...sx }}>
        <Lead label="AARES result" />
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{ flexWrap: "wrap" }}
        >
          {stats.map((stat) => (
            <Stack
              justifyContent="center"
              sx={{
                border: (theme) => `1px solid ${theme.borderColor} `,
                minHeight: "150px",
                textAlign: "center",
                color: "primary.main",
                my: 3,
                borderRadius: 2,
                px: 1,
                minWidth: {
                  xs: "180px",
                  s567: "120px",
                  s768: "180px !important",
                },
              }}
            >
              <Typography noWrap sx={{ fontSize: "24px", fontWeight: "bold" }}>
                {stat.statistic}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {stat.title}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </>
  );
}

Poll.propTypes = {};

export default Poll;
