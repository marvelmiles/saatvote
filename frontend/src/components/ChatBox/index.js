import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { animated, useSpring, useTransition } from "react-spring";
import Conversations from "./Conversations";
import { IconButton, Stack, Typography } from "@mui/material";
import {
  ChatBubbleOutlined,
  Close,
  KeyboardDoubleArrowDown,
} from "@mui/icons-material";
import { ResizeEffect } from "../detect-window-resize";
import { setCookie } from "../../helpers";
import withChatBox from "./withChatBox";
import DrawerSlide from "../DrawerSlide";
import Chat from "./Chat";

const R = () => {
  return "lll";
};
const ChatScreen = ({
  style = {},
  onClick = () => {},
  onClose = () => {},
  chat,
  user,
  cookie,
}) => {
  const [_chat, _setChat] = useState(null);
  const displayFlow = Boolean(_chat);
  if (chat)
    return <Chat chat={chat} user={user} cookie={cookie} onClose={onClose} />;
  return (
    <DrawerSlide
      sx={style}
      displayFlow={displayFlow}
      displayElement={
        <Conversations
          onClick={(conv) => {
            _setChat(conv);
          }}
          header={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: "5px" }}
            >
              <Typography component="span" variant="h3" color="text.light">
                Chats
              </Typography>
              <IconButton
                variant="icon"
                sx={{ m: 0, mt: "5px", backgroundColor: "primary.main" }}
                onClick={onClose}
              >
                <KeyboardDoubleArrowDown />
              </IconButton>
            </Stack>
          }
          onClose={onClose}
          cookie={cookie}
        />
      }
      flowElement={
        <Chat
          chat={_chat}
          user={user}
          onClose={onClose}
          goBack={() => _setChat(null)}
          cookie={cookie}
          withConversation
        />
      }
    />
  );
};

function ChatBox({ chat, user, cookie }) {
  const [state, setState] = useState({
    withComp: Conversations,
  });
  const [openAS, setOpenAS] = useState(false);
  const [resizeNode, setResizeNode] = useState(null);
  const initWidth = 160;
  const initHeight = 50;
  const resizeData = useRef();
  const [asStyles, api] = useSpring(() => {
    return {
      width: initWidth,
      height: initHeight,
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

  const handleOpenChat = (user) => {
    setCookie({
      chat: user,
    });
  };

  const AnimatedScreen = animated(Box);
  const onResize = () => {};
  return (
    <>
      <ResizeEffect
        disableEffect={!openAS}
        onEffect={(data) => {
          resizeData.current = data;
          if (data.event)
            api.start({
              width: data.node.width,
              height: data.node.height,
            });
        }}
        resizeNode={resizeNode}
        resizeData={{
          node: {
            width: 350,
            height: 500,
          },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            right: 10,
            zIndex: "modal",
            p: 0,
          }}
        >
          <AnimatedScreen
            style={asStyles}
            sx={{ boxShadow: 25, backgroundColor: "primary.main", p: 0 }}
            ref={(node) => {
              setResizeNode(node);
            }}
            id="dave"
          >
            {transitions(({ opacity }, bool) =>
              bool ? (
                <ChatScreen
                  cookie={cookie}
                  chat={chat}
                  user={user}
                  onClose={() => {
                    setOpenAS(false);
                    api.start({
                      width: initWidth,
                      height: initHeight,
                    });
                  }}
                  style={{
                    position: "absolute",
                    opacity: opacity.to({
                      range: [0.0, 1.0],
                      output: [0, 1],
                    }),
                  }}
                  onResize={onResize}
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
                    const { node } = resizeData.current;
                    api.start({
                      width: node.width,
                      height: node.height,
                    });
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
    </>
  );
}

ChatBox.propTypes = {};

export default ChatBox;
