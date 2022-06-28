import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Progress from "../Progress";
import Stack from "@mui/material/Stack";
import KeyboardDoubleArrowDown from "@mui/icons-material/KeyboardDoubleArrowDown";
import {
  ArrowLeftOutlined,
  EmojiEmotionsOutlined,
  FileCopy,
  GifBoxOutlined,
  KeyboardBackspace,
  MicNoneOutlined,
  PhotoCameraBack,
} from "@mui/icons-material";
import Messages from "./Mesages";
import Input from "../Editor/Input";
import Picker from "../Emoji/components/Picker";
import MentionSuggestions from "./components/MentionSuggestions";
import { EditorState } from "draft-js";
import { uniq } from "../../helpers";
import { set } from "lodash";
function Chat({ goBack, onClose, chat }) {
  const [mentionEvent, setMentionEvent] = useState({});
  const [expandMedia, setExpandMedia] = useState(false);
  const [emoticon, setEmoticon] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef();

  useEffect(() => {
    if (!chat) goBack();
  }, [chat, goBack]);
  if (!chat) return <Progress />;
  const { name } = chat;
  const insertEmoji = () => {};
  const mentionSuggestions = [
    "akinrinmola",
    "abiaola",
    "adewale",
    "bisola",
    "bidemi",
    "busayo",
    "caleb",
    "catherine",
    "cayetana",
  ];

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          border: "2px solid green",
          // overflow: "hidden",
          boxShadow: "0 5px 30px rgba(0, 0, 0, .2)",
          backgroundColor: "rgba(0, 0, 0, .5)",
          borderRadius: "inherit",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            position: "relative",
            flex: "0 1 45px",
          }}
        >
          <IconButton
            variant="icon"
            sx={{
              m: 0,
              mt: "5px",
              backgroundColor: "primary.main",
              alignSelf: "flex-start",
            }}
            onClick={goBack}
          >
            <KeyboardBackspace />
          </IconButton>
          <Stack sx={{ maxWidth: "60%", alignSelf: "center" }}>
            <Typography
              component="span"
              noWrap
              variant="body1"
              color="text.light"
            >
              Temitope bankole...
            </Typography>
            <Typography
              noWrap
              component="span"
              variant="body2"
              color="text.light"
            >
              304 messages
            </Typography>
          </Stack>
          <IconButton
            variant="icon"
            sx={{
              m: 0,
              mt: "5px",
              backgroundColor: "primary.main",
              alignSelf: "flex-start",
            }}
            onClick={onClose}
          >
            <KeyboardDoubleArrowDown />
          </IconButton>
        </Stack>
        <Messages />
        <Box
          sx={{
            flex: "1 0 auto",
            border: "1px solid transparent",
            // overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              background: "red",
              top: "-1px",
              height: 0,
            }}
          >
            <MentionSuggestions
              mentionEvent={mentionEvent}
              editorState={editorState}
              open={Boolean(mentionEvent.trigger)}
              suggestions={mentionSuggestions}
              onAddMention={() => setMentionEvent({})}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // background:"primary.main"
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                border: "2px solid blue",
                flex: "0 0 auto",
              }}
            >
              {expandMedia ? (
                <IconButton variant="icon">
                  <ArrowLeftOutlined />
                </IconButton>
              ) : (
                <>
                  <IconButton variant="icon">
                    <PhotoCameraBack />
                  </IconButton>
                  <IconButton variant="icon">
                    <GifBoxOutlined />
                  </IconButton>
                </>
              )}
            </Box>
            <Box
              sx={{
                border: "1px solid red",
                minWidth: "0",
                // maxWidth: "40%",
                display: "flex",
                borderRadius: 4,
                width: "100%",
                minHeight: "0px",
                p: "2px",
              }}
              // Handling expansion at the top level improves user expo on smaller screen size if cursor isn't seen
              onClick={(e) => {
                e.preventDefault();
                setExpandMedia(true);
                editorRef.current.focus();
              }}
            >
              <Input
                // editorState={editorState}
                // onChange={(state) => setEditorState(editorState)}
                onBlur={() => {
                  // console.log("blurred");
                  // setMentionEvente({});
                  setExpandMedia(false);
                }}
                pluginsConfig={{
                  mention: {
                    onMention(e) {
                      if (e.currentTarget) setMentionEvent(e);
                      else setMentionEvent({});
                    },
                  },
                }}
                // onChange={(state) => setEditorState(state)}
                // editorState={editorState}
                ref={editorRef}
              />
              <IconButton
                variant="icon"
                sx={{
                  alignSelf: "flex-end",

                  position: "relative",
                  top: "-2px",
                }}
                onClick={(e) => {
                  // e.preventDefault();
                  e.stopPropagation();
                  setEmoticon(emoticon ? null : e.target);
                }}
              >
                <EmojiEmotionsOutlined />
              </IconButton>
            </Box>
            <Box
              sx={{
                border: "2px solid purple",
                flex: "0 0 auto",
              }}
            >
              <IconButton variant="icon">
                <MicNoneOutlined />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Stack>
      <Picker
        open={Boolean(emoticon)}
        anchorEl={emoticon}
        onClick={insertEmoji}
      />
    </>
  );
}

Chat.propTypes = {};

export default Chat;
