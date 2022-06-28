import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
function ScrollTop({ children, anchor }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const handleClick = (event) => {
    let node = (event.target.ownerDocument || document).querySelector(anchor);
    console.log(node);
    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      console.log(node, "tyu");
    }
  };
  return (
    <>
      <Zoom in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Zoom>
    </>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  anchor: PropTypes.string.isRequired,
};

export default ScrollTop;
