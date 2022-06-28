// import React, { useState } from "react";
// import { Editor, EditorState } from "draft-js";
// import { Box } from "@mui/system";
// export default function ChatBox() {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());
//   return (
//     <>
//       <Box>Editor</Box>
//       <Editor editorState={editorState} onChange={setEditorState} />
//     </>
//   );
// }

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  ButtonGroup,
  ClickAwayListener,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  AttachmentOutlined,
  Chat,
  ChatBubbleOutlined,
  EmojiEmotionsOutlined,
  SendOutlined,
} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import {
  animated,
  config,
  SpringRef,
  useSpring,
  useSpringRef,
  useTransition,
} from "react-spring";
import TextInput from "./TextInput";
import { useRef } from "react";
import { useEffect } from "react";
import EmojiMart from "./EmojiMart";
import { EditorState, Editor, Modifier } from "draft-js";
import { defaultMaxListeners } from "form-data";
function ChatBox(props) {
  const windowRef = useRef(null);
  const inputRef = useRef();
  const getCalcHeights = () => {
    // constant values is meant for margin and spacing
    const wr = windowRef.current;
    let defaultHeights = { wrh: 600, wrw: "90vw", fromWrw: "90vw" };
    if (wr) {
      const doc = document.querySelector("#stat");
      const _calcHeight = () => {
        let diff = 0;
        let wrh = wr.clientHeight;
        let wih = window.innerHeight;
        if (defaultHeights.wrh > wih) {
          defaultHeights.wrh = wih - 20;
          if (doc) {
            doc.textContent = `default > wih ${wrh} ${wih} = ${defaultHeights.wrh}`;
          }
        } else if (wrh > wih) {
          diff = wrh - wih - 100;
          wrh = wrh - diff;
          defaultHeights.wrh = wrh;
          if (doc) {
            doc.textContent = `wrh > wih ${wrh} ${wih} = ${defaultHeights.wrh}`;
          }
        }
      };
      const _calcWidth = () => {
        let wiw = window.innerWidth;
        if (wiw > 500) {
          defaultHeights.wrw = "500px";
        }
        if (wiw > 200) defaultHeights.fromWrw = "180px";
      };
      _calcWidth();
      _calcHeight();
      console.log(defaultHeights);
      return defaultHeights;
    } else {
      console.log("default wr undefined", wr);
      return defaultHeights;
    }
  };
  const [openChatWindow, setOpenChatWindow] = useState(false);
  const [calcHeights, setCalcHeights] = useState({
    wrh: 0,
    wrw: "90vw",
    fromWrw: "180px",
  });
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const { wrh, wrw, fromWrw } = calcHeights;
  // function playSound(url) {
  //     const audio = new Audio(url);
  //     audio.play();
  //   }
  const emojiCallerRef = useRef();
  useEffect(() => {
    const c = getCalcHeights();
    setCalcHeights(c);
    window.addEventListener(
      "resize",
      () => {
        setCalcHeights(getCalcHeights());
      },
      false
    );
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    input && (input.selectionEnd = cursorPosition);
  }, [cursorPosition]);

  const chatWindowStyles = useSpring({
    miWidth: "0",
    width: openChatWindow ? wrw : fromWrw,
    height: openChatWindow ? wrh + "px" : "50px",
    borderRadius: "10px",
    delay: openChatWindow ? 50 : 0,
  });

  const ChatWindow = animated(Box);

  const transitions = useTransition(openChatWindow, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    //reverse: openChatWindow,
    immediate: true,
    onRest: () => {
      if (openChatWindow) {
        if (inputRef.current) inputRef.current.focus();
      }
    },
  });

  
  return (
    <>
      {/* <h1>ddddd</h1>
      <div class="outer">
        <div class="inner"></div>
      </div> */}
      <Box id="stat"></Box>
      <ClickAwayListener
        onClickAway={() => {
          setOpenChatWindow(false);
        }}
      >
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            left: 10,
            zIndex: "modal",
          }}
        >
          <ChatWindow
            sx={{
              backgroundColor: "primary.main",
              position: "relative",
              height: "50px",
              overflow: "hidden",
              // border: "2px solid green",
              boxShadow: (theme) =>
                `0 0 5px 5px ${theme.palette.primary.greyLight}`,
            }}
            style={{
              ...chatWindowStyles,
            }}
            ref={windowRef}
          >
            {transitions(({ opacity }, item) =>
              item ? (
                <>
                  <Stack
                    style={{
                      position: "absolute",
                      opacity: opacity.to({
                        range: [0.0, 1.0],
                        output: [0, 1],
                      }),
                    }}
                    sx={{
                      opacity: 1,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{
                        px: 1,
                        py: 0,
                        backgroundColor: "secondary.main",
                        // height: "20%",
                      }}
                    >
                      <Avatar
                        variant="avatar"
                        sx={{ mr: 1, width: 30, height: 30 }}
                      />
                      <Box
                        sx={{
                          overflow: "hidden",
                        }}
                      >
                        <Typography noWrap variant="h4" sx={{ color: "#fff" }}>
                          uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
                        </Typography>
                        <Typography
                          noWrap
                          variant="subtitle1"
                          sx={{ color: "#fff" }}
                        >
                          uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
                        </Typography>
                      </Box>
                      <IconButton
                        variant="icon"
                        sx={{
                          backgroundColor: "secondary.light  !important",
                          color: "secondary.contrastText",
                          width: 30,
                          height: 30,
                        }}
                      >
                        <Chat />
                      </IconButton>
                    </Stack>
                    <Box
                      sx={{
                        overflow: "auto",
                        // border: "1px solid red",
                        minHeight: 0,
                        //height: `40% !important`,
                      }}
                    >
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        4, 0, 3, 0, 2, 1,
                      ].map((message, i) => (
                        <Box
                          key={i}
                          sx={{ color: message > 0 ? "secondary" : "#fff" }}
                        >
                          jjjj
                        </Box>
                      ))}
                    </Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        height: "20%",
                        maxHeight: "50px",
                        backgroundColor: "secondary.main",
                        mb: 0,
                        p: "5px",
                        // border: "1px solid purple",
                      }}
                      // chat box actions
                    >
                      <ButtonGroup>
                        <IconButton
                          variant="icon"
                          sx={{
                            // backgroundColor: "secondary.main",
                            borderWidth: 0,
                          }}
                          onClick={() => {
                            setOpenEmoji(!openEmoji);
                          }}
                          ref={emojiCallerRef}
                        >
                          <EmojiEmotionsOutlined sx={{ color: "#fff" }} />
                        </IconButton>
                        <IconButton
                          variant="icon"
                          sx={{
                            // backgroundColor: "secondary.main",
                            borderWidth: 0,
                          }}
                        >
                          <AttachmentOutlined sx={{ color: "#fff" }} />
                        </IconButton>
                      </ButtonGroup>
                      <div
                        ref={inputRef}
                        // inputComponent="textarea"
                        // inputProps={{
                        //   ref: inputRef,
                        //   type: "textarea",
                        //   sx: {
                        //     mb: 0,
                        //     backgroundColor: "transparent",
                        //     borderWidth: 0,
                        //     color: "secondary.contrastText",
                        //     pl: "5px",
                        //     resize: "none",
                        //   },
                        //   onChange: (e) => setMessage(e.target.value),
                        // }}
                        style={{
                          mb: 0,
                          height: "100%",
                          width: "100px",
                          overflow: "scroll",
                          border: "1px solid red",
                        }}
                      ></div>
                      <IconButton
                        variant="icon"
                        sx={{
                          borderWidth: 0,
                        }}
                      >
                        <SendOutlined sx={{ color: "#fff" }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <EmojiMart
                    open={openEmoji}
                    onClick={(emojiElement) => {
                      const input = inputRef.current;
                      if (input) {
                        input.focus();
                        // const start = message.substring(
                        //   0,
                        //   input.selectionStart
                        // );
                        // const end = message.substring(input.selectionStart);
                        // const text = message + emojiElement;
                        // console.log(emojiElement, text, "yuii");

                        setMessage(emojiElement);
                        // setCursorPosition(start.length + emoji.length);
                      }
                    }}
                    ClickAwayException={emojiCallerRef.current}
                  />
                </>
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  sx={{
                    //p: 1,
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    zIndex: 5,
                  }}
                  style={{
                    position: "absolute",
                    opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
                  }}
                  onClick={() => {
                    setOpenChatWindow(true);
                    // start.start({
                    //   width: "300px",
                    //   height: wrh + "px",
                    //   //maxWidth: "600vw",
                    //   borderRadius: "5px",
                    //   overflow: "hidden",
                    // });
                  }}
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
              )
            )}
          </ChatWindow>
        </Box>
      </ClickAwayListener>
    </>
  );
}

ChatBox.propTypes = {};

export default ChatBox;
