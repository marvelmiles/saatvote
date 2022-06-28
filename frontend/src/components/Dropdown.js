import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Input,
  InputAdornment,
  List,
  ListItem,
  Paper,
  Popper,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import { FilterAlt } from "@mui/icons-material";

const getClientPos = (el) => {
  let pos = { top: 0, left: 0 };
  if (!el) return pos;
  function getCoords(elem) {
    // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  }
  console.log(getCoords(el));
  return {
    top: 547,
    left: 539,
  };
};

function Dropdown({ inputProps, list = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = useRef();
  return (
    <>
      <Box>
        <Input
          {...inputProps}
          endAdornment={
            <InputAdornment
              ref={anchorRef}
              position="end"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <FilterAlt sx={{ fontSize: "24px", mb: 1 }} />
            </InputAdornment>
          }
        />
        <Popover
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          open={!!anchorEl}
          anchorReference="anchorPosition"
          anchorPosition={getClientPos(anchorEl)}
        >
          <Box
            sx={{
              // maxHeight: "150px",
              // overflow: "auto",
              boxShadow: 5,
              borderRadius: 2,
            }}
          >
            {Array.from(Array(14)).map((_, i) => (
              <ListItem sx={{ color: "red" }}> llist {i}</ListItem>
            ))}
          </Box>
        </Popover>
      </Box>
    </>
  );
}

Dropdown.propTypes = {};

export default Dropdown;
