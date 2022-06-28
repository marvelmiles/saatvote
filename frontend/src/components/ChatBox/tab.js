import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { animated, useSpring, useTransition } from "react-spring";
import Conversations from "./Conversations";
import { IconButton, Stack, Typography } from "@mui/material";
import { ChatBubbleOutlined } from "@mui/icons-material";
import { ResizeEffect } from "../detect-window-resize";

function ChatBox() {
  const [openAS, setOpenAS] = useState(false);
  const resizeNodeRef = useRef();
  const resizeDataRef = useRef({
    node: {
      width: 160,
      height: 500,
    },
  });
  const { node } = resizeDataRef.current;
  const [asStyles, api] = useSpring(() => {
    console.log("ue-spring...");
    return {
      width: 160,
      height: 50,
      borderRadius: "10px",
      delay: openAS ? 50 : 0,
    };
  });

  const transitions = useTransition(openAS, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: openAS,
    immediate: true,
    onRest: () => {
      // if (openAS) {
      //   console.log(inputRef.current);
      //   if (inputRef.current) inputRef.current.focus();
      //   else console.log("input ref not found...");
      // }
    },
  });

  const AnimatedScreen = animated(Box);
  return (
    <>
      {
        <ResizeEffect
          resizeNode={resizeNodeRef.current}
          resizeData={{
            node: {
              width: 300,
              height: 500,
            },
          }}
          onEffect={({ node, event }) => {
            console.log(node, event, openAS, "on effect");
            if (event && openAS) {
              console.log("openas event", openAS);
              api.start({
                width: node.width,
                height: node.height,
              });
            } else if (openAS) {
              console.log("openas is false", openAS);
              api.start({
                width: node.width,
                height: node.height,
              });
            }
          }}
          onResize={(e) => {
            console.log(e);
          }}
        >
          <Box
            sx={{
              position: "fixed",
              bottom: 10,
              right: 10,
              zIndex: "modal",
            }}
          >
            <AnimatedScreen
              style={asStyles}
              sx={{ boxShadow: 25, backgroundColor: "primary.main" }}
              ref={resizeNodeRef}
            >
              {transitions(({ opacity }, bool) =>
                bool ? (
                  <Conversations
                    onClose={() => {
                      api.start({
                        width: 160,
                        height: 50,
                      });
                      setOpenAS(false);
                    }}
                    styles={{
                      root: {
                        position: "absolute",
                        opacity: opacity.to({
                          range: [0.0, 1.0],
                          output: [0, 1],
                        }),
                      },
                    }}
                  />
                ) : (
                  <Stack
                    direction="row"
                    color="primary.light"
                    alignItems="center"
                    sx={{
                      px: 1,
                      cursor: "pointer",
                    }}
                    style={{
                      position: "absolute",
                      opacity: opacity.to({
                        range: [1.0, 0.0],
                        output: [1, 0],
                      }),
                    }}
                    onClick={() => {
                      console.log("starting....");
                      // api.start({
                      //   width: node.width,
                      //   height: node.height,
                      //   //maxWidth: "600vw",
                      //   borderRadius: "5px",
                      //   overflow: "hidden",
                      // });
                      setOpenAS(true);
                    }}
                  >
                    <IconButton variant="icon">
                      <ChatBubbleOutlined />
                    </IconButton>
                    <Typography component="span" variant="h4" noWrap>
                      start Chat
                    </Typography>
                  </Stack>
                )
              )}
            </AnimatedScreen>
          </Box>
        </ResizeEffect>
      }
    </>
  );
}

ChatBox.propTypes = {};

export default ChatBox;

// export default withResizeEffect(ChatBox, {
//   initData: {
//     node: {
//       height: 50,
//       width: 160,
//     },
//   },
//   resizeData: {
//     node: {
//       width: 300,
//       height: 500,
//     },
//   },
// });
