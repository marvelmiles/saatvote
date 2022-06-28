import React from "react";
import PropTypes from "prop-types";
import { Slide, Stack } from "@mui/material";
import Box from "@mui/material/Box";
// appear false doesn't aplly the enter-* displayFlow.
// it use to manage initial displayFlowon mount before in displayFlow changes

function DrawerSlide({
  displayFlow = false,
  displayElement,
  flowElement,
  style = {},
}) {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          border: "1px solid purple",
          overflowX: "hidden",
          my: 1,
          ...style,
        }}
      >
        <Slide
          appear={false}
          sx={{ minWidth: "100%", height: "100%", borderRadius: "inherit" }}
          in={displayFlow}
          direction="left"
        >
          <Box>{flowElement}</Box>
        </Slide>
        <Slide
          appear={false}
          sx={{
            minWidth: "100%",
            height: "100%",
            transform: "translateX(-100%)",
            p: 0,
            borderRadius: "inherit",
          }}
          direction="right"
          in={!displayFlow}
          onEntering={(node) => {
            node.style.transform = "translatex(-100%)";
          }}
        >
          <Box>{displayElement}</Box>
        </Slide>
      </Stack>
    </>
  );
}

DrawerSlide.propTypes = {};

export default DrawerSlide;
