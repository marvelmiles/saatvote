import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  ClickAwayListener,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChatBubbleOutlined } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
function ChatBox(props) {
  const [openChatBox, setOpenChatBox] = useState(false);
  // function playSound(url) {
  //     const audio = new Audio(url);
  //     audio.play();
  //   }

  return (
    <>
      {/* <h1>ddddd</h1>
      <div class="outer">
        <div class="inner"></div>
      </div> */}
      <ClickAwayListener onClickAway={() => setOpenChatBox(false)}>
        <Box sx={{ position: "fixed", bottom: 10, right: 10 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                borderRadius: openChatBox ? 4 : 6,
                width: openChatBox ? 300 : 180,
                height: openChatBox ? 500 : 50,
                backgroundColor: "primary.main",
                transition: "all .55s ease-in-out",
              }}
            >
              {openChatBox ? (
                <Stack sx={{}}>chat box</Stack>
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  sx={{
                    p: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenChatBox(true)}
                >
                  <IconButton
                    variant="icon"
                    sx={{ borderColor: "primary.light" }}
                  >
                    <ChatBubbleOutlined sx={{ color: "primary.light" }} />
                  </IconButton>
                  <Typography
                    variant="h4"
                    component="span"
                    sx={{ color: "#fff" }}
                  >
                    Start chat
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </ClickAwayListener>
    </>
  );
}

ChatBox.propTypes = {};

export default ChatBox;
