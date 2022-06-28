import React from "react";
import PropTypes from "prop-types";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import { Emoji } from "emoji-mart";
function SkinSelector({ emoji, open, anchorEl }) {
  return (
    <>
      <Popper open={open} anchorEl={anchorEl} disablePortal keepMounted>
        <Stack
          direction="row"
          sx={{
            elevation: 10,
            zIndex: 30000,
            background: "red",
          }}
        >
          <Emoji emoji={emoji.id} skin={1} size={emoji.size} />
          <Emoji emoji={emoji.id} skin={2} size={emoji.size} />
          <Emoji emoji={emoji.id} skin={3} size={emoji.size} />
          <Emoji emoji={emoji.id} skin={4} size={emoji.size} />
          <Emoji emoji={emoji.id} skin={5} size={emoji.size} />
          <Emoji emoji={emoji.id} skin={6} size={emoji.size} />
        </Stack>
      </Popper>
    </>
  );
}

SkinSelector.propTypes = {};

export default SkinSelector;
