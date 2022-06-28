import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Dialog as MuiDialog } from "@mui/material";
import { SlideUp } from "./Animation";
import { makeStyles } from "@mui/styles";
import { Close } from "@mui/icons-material";

// export const ZoomIn = (props) => {
//   useEffect(() => {
//     console.log(props);
//   }, []);
//   return (
//     <>
//       <Box
//         data-id="dialoging..."
//         sx={{
//           border: "1px solid red",
//           animationName: "zoomIn",
//           animationDuration: "5s",
//           "-webkit-animation-duration": "5s",
//           "animation-duration": "5s",
//           "-webkit-animation-duration": "5s",
//           "animation-duration": "15s",
//           "-webkit-animation-fill-mode": "both",
//           "animation-fill-mode": "both",
//           "@keyframes zoomIn": {
//             from: {
//               opacity: 0,
//               "-webkit-transform": "scale3d(0.3, 0.3, 0.3)",
//               transform: "scale3d(0.3, 0.3, 0.3)",
//             },
//             "50%": {
//               opacity: 1,
//             },
//           },
//         }}
//       >
//         {props.children}
//       </Box>
//     </>
//   );
// };

function Dialog({
  open = false,
  onClose,
  header,
  content,
  dividers = {},
  footer,
  onMounted,
  onUnMount,
  closeOnBackdrop = false,
  keepMounted = false,
  styles = {},
}) {
  let state = useRef({});
  state = state.current;
  dividers = {
    top: typeof dividers.top === "boolean" ? dividers.top : true,
    bottom: typeof dividers.bottom === "boolean" ? dividers.bottom : true,
  };
  useEffect(() => {
    if (open) {
      if (!state.hasInit) {
        typeof onMounted === "function" &&
          onMounted({
            header,
            content,
            open,
          });
        state.hasInit = true;
      }
    } else {
      if (!keepMounted) state.hasInit = false;
      if (typeof onUnMount === "function") onUnMount();
    }
  }, [open, content, header, onMounted, keepMounted, onUnMount]);
  const classes = makeStyles({
    paper: {
      minWidth: "0",
      width: "100%",
      maxWidth: "600px",
      margin: "0 16px",
      height: "90vh",
      maxHeight: "700px",
      ...styles.paper,
    },
  })();

  return (
    <MuiDialog
      data-id="dialog-container"
      classes={classes}
      open={open}
      onClose={
        closeOnBackdrop && typeof onClose === "function" ? onClose : () => {}
      }
      keepMounted={keepMounted}
      TransitionComponent={SlideUp}
    >
      {header && (
        <DialogTitle sx={styles.title}>
          {header}
          {typeof onClose === "function" && (
            <IconButton
              sx={{
                backgroundColor: "red",
                color: "#fff",
                alignSelf: "flex-end",
                position: "absolute",
                right: 0,
                top: 0,
                borderRadius: "initial",
              }}
              onClick={onClose}
            >
              <Close sx={{ fontSize: "24px" }} />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent
        sx={{
          borderStyle: "solid",
          borderColor: (theme) => theme.palette.divider,
          borderWidth: 0,
          borderTopWidth: dividers.top ? 1 : 0,
          borderBottomWidth: dividers.bottom ? 1 : 0,
        }}
      >
        {content}
      </DialogContent>
      {footer && <DialogActions>{footer}</DialogActions>}
    </MuiDialog>
  );
}

Dialog.propTypes = {};

export default Dialog;
