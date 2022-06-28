import PropTypes from "prop-types";
import { Box } from "@mui/system";

function Flip({ children, angle = 0, sx }) {
  const flip = {
    minWidth: "0px",
    maxWidth: "100%",
    minHeight: "0px",
    height: "auto",
    perspective: "1200px",

    ...sx,
  };
  // #dd8800
  const flipFront = {
    transform: `rotateY(${angle}deg)`,
    transition: "transform 1s",
    zIndex: 1,
  };

  // "#dd8800"
  const flipBack = {
    backgroundColor: "orange",
    transform: `rotateY(${angle}deg)`,
    transition: "transform 1s",
  };

  return (
    <>
      <Box sx={flip}>
        <Box sx={flipFront}>
          <Box>{children}</Box>
        </Box>
        <Box sx={flipBack}>
          <Box></Box>
        </Box>
      </Box>
    </>
  );
}

Flip.propypes = {};

export default Flip;
