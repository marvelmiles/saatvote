import React from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Twitter } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

function Person({
  children,
  styles = {},
  required = {
    title2: true,
    title1: true,
  },
  src,
  actionRend,
  title1,
  title2,
  title3,
  header,
  editorMode = false,
  onSelect = () => {},
  owner = "",
  hasPreviledge = false,
}) {
  return (
    <>
      <Paper
        direction="row"
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "200px !important",
          boxShadow: 12,
          p: 1,
          my: 2,
          borderRadius: 1,
          ...styles.paper,
        }}
      >
        {editorMode && (
          <Stack sx={{ position: "absolute" }}>
            {hasPreviledge ? (
              <>
                <IconButton
                  variant="icon"
                  sx={_styles.icon}
                  onClick={(e) => onSelect("edit", e)}
                >
                  <EditIcon sx={{ fontSize: "2rem !important" }} />
                </IconButton>
                <IconButton
                  variant="icon"
                  sx={_styles.icon}
                  onClick={(e) => onSelect("delete", e)}
                >
                  <DeleteIcon sx={{ fontSize: "2rem !important" }} />
                </IconButton>
              </>
            ) : owner ? (
              <Tooltip
                title={
                  <Box>
                    <Typography> Created by - </Typography>
                    <Typography
                      sx={{
                        maxWidth: "120px",
                      }}
                    >
                      {owner}
                    </Typography>
                  </Box>
                }
                placement="right-start"
                arrow
              >
                <IconButton variant="icon" sx={_styles.icon}>
                  <PersonIcon sx={{ fontSize: "2rem !important" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Skeleton
                animation="wave"
                variant="circular"
                sx={{
                  width: "35px",
                  height: "35px",
                }}
              />
            )}
          </Stack>
        )}
        <Box>
          {src ? (
            <Avatar sx={_styles.avatar} />
          ) : (
            <Skeleton animation="wave" variant="circular" sx={_styles.avatar} />
          )}
          <Box sx={{ textAlign: "center", mt: 2, wordBreak: "break-word" }}>
            {title1 ? (
              <Typography variant="h4">{title1}</Typography>
            ) : (
              <Skeleton animation="wave" height="10px" />
            )}
            {title2 ? (
              <Typography variant="h5">{title2}</Typography>
            ) : (
              <Skeleton animation="wave" height="10px" />
            )}
            {title3 ? (
              <Typography variant="h5" sx={{ letterSpacing: "1px" }}>
                {title3}
              </Typography>
            ) : required.title3 ? (
              <Skeleton animation="wave" height="10px" />
            ) : null}
          </Box>
          {children}
        </Box>
      </Paper>
    </>
  );
}

const _styles = {
  icon: {
    width: "35px",
    height: "35px",
    mb: 1,
    "& svg": {
      fontSize: "2rem",
    },
  },
  avatar: { mx: "auto", my: 1, width: 56, height: 56 },
};

Person.propTypes = {};

export default Person;
