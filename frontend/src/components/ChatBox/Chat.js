import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Progress from "../Progress";
import Stack from "@mui/material/Stack";
import KeyboardDoubleArrowDown from "@mui/icons-material/KeyboardDoubleArrowDown";
import {
  ArrowLeftOutlined,
  Delete,
  EmojiEmotionsOutlined,
  FileCopy,
  GifBoxOutlined,
  KeyboardBackspace,
  MicNoneOutlined,
  PhotoCameraBack,
  Send,
} from "@mui/icons-material";
import Messages from "./Mesages";
import Input from "../Editor/Input";
import MentionSuggestions from "./components/MentionSuggestions";
import { convertToRaw, EditorState } from "draft-js";
import AudioRecorder from "../Audio/AudioRecorder";
import {
  cipherIv,
  createECDH,
  createHmac,
  createPbk,
  debounce_leading,
  getCookie,
} from "../../helpers";
import { useContext } from "../../provider";
import crypto from "crypto";
import { getEntities, getRawState, serialize } from "../Editor/utils";
import { AUDIO_KIND, TEXT_KIND } from "./constants";
import { CONSTANTS } from "../../config";
import Redirect from "../../components/Redirect";
import axios, { redirect } from "../../api/axios";
function Chat({ goBack, onClose, chat, user, cookie, withConversation }) {
  const [mentionEvent, setMentionEvent] = useState({});
  const [expandMedia, setExpandMedia] = useState(false);
  const [emoticon, setEmoticon] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [retrieveAudioData, setRetrieveAudioData] = useState(false);
  const [openRecorder, setOpenRecorder] = useState(false);
  // const [hasText, setHasText] = useState(false);
  const [encryptedMsg, setEncryptedMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  let cache = useRef({
    goBack,
  });
  cache = cache.current;
  const audioUrl = useRef();
  const { socket } = useContext();
  if (socket.disconnected) socket.connect();
  const _user = localStorage.getItem("user");
  useEffect(() => {
    if (!chat && cache.goBack) cache.goBack();
  }, [chat, cache]);
  user = user || cookie.user;
  if (!user) {
    return <Redirect to={``} />;
  }

  const getComputedSecret = () => {
    if (cache.computedSecret) return cache.computedSecret;
    let pvk = cipherIv.decrypt(
      user.privateKeyCipher,
      createPbk(user.email, user.auth)
    );
    const edch = createECDH(pvk);
  
    const c = edch
      .computeSecret(Buffer.from(chat.publicKey, "hex"))
      .toString("hex");
    console.log(
      edch.getPrivateKey().toString("hex") === pvk.toString("hex"),
      "new edch"
    );
    const secret = createPbk(c);
    cache.computedSecret = secret;
    return secret;
  };
  const getChannelId = () => {
    return createHmac([user.id, chat.id].sort().join());
  };
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
  const decryptMsg = (msgObj, passphrase) => {
    let decrypted = true;
    msgObj.content = JSON.parse(
      cipherIv.decrypt(msgObj.content, passphrase, "utf-8", true)
    );
    msgObj.kind = JSON.parse(
      cipherIv.decrypt(msgObj.kind, passphrase, "utf-8")
    );
    if (!msgObj.content || !msgObj.kind) decrypted = false;
    msgObj.decrypted = decrypted;
    return msgObj;
  };
  const encryptMsg = (msgObj, passphrase) => {
    for (let k in msgObj) {
      msgObj[k] = cipherIv.encrypt(
        JSON.stringify(msgObj[k]),
        passphrase,
        "utf-8"
      );
    }
    msgObj["channelId"] = getChannelId();
    msgObj["senderPbkHash"] = user.pbkHash;
    msgObj["receiverPbkHash"] = chat.pbkHash;
    return msgObj;
  };

  const hasMsg = !!message;
  const sendMsg = async () => {
    try {
      if (!(hasMsg || audioUrl)) return;
      const enc = encryptMsg(
        {
          content: hasMsg ? message : audioUrl,
          kind: hasMsg ? TEXT_KIND : AUDIO_KIND,
        },
        getComputedSecret()
      );
      // console.log(getComputedSecret());
      await axios.post(`/${_user}/chats/dm`, enc, {
        headers: {
          Authorization: `Bearer ${cookie.jwtToken}`,
        },
      });
      setMessage("");
    } catch (err) {
      console.log("err sending", err?.response?.data?.message || err.message);
    }
  };
  if (!_user) return redirect();
  if (withConversation && !chat) return <Progress />;

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
          {goBack && (
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
          )}
          <Stack sx={{ maxWidth: "60%", alignSelf: "center" }}>
            <Typography
              component="span"
              noWrap
              variant="body1"
              color="text.light"
            >
              {chat.email}
            </Typography>
            <Typography
              noWrap
              component="span"
              variant="body2"
              color="text.light"
            >
              {user.email}
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
        <Messages
          encryptMsg={encryptMsg}
          decryptMsg={decryptMsg}
          user={user}
          chat={chat}
          encryptedMsg={encryptedMsg}
          getComputedSecret={getComputedSecret}
        />
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
            {openRecorder ? (
              <AudioRecorder
                autoRecord
                actionElement={
                  <IconButton
                    variant="icon"
                    onClick={() => setOpenRecorder(false)}
                  >
                    <Delete />
                  </IconButton>
                }
                onStop={({ forceStop, audioUrl }) => {
                  if (forceStop) {
                    audioUrl.current = audioUrl;
                    setOpenRecorder(false);
                    console.log("saved auido url", audioUrl);
                  }
                }}
                forceStop={retrieveAudioData}
              />
            ) : (
              <>
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
                    // setExpandMedia(true);
                    // editorRef.current.focus();
                  }}
                >
                  <Box
                    component="textarea"
                    sx={{
                      resize: "none",
                      border: "inherit",
                      borderRadius: "inherit",
                      background: "transparent",
                      color: "#fff",
                      p: "5px 16px",
                      minHeight: 0,
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {/* <Input
                    editorState={editorState}
                    onChange={(_editorState) => {
                      const c = convertToRaw(_editorState.getCurrentContent());
                      // document.querySelector("#stats").textContent =
                      // JSON.stringify(c);
                      console.log(
                        Object.keys(c.entityMap).length,
                        "entity map"
                      );
                      setEditorState(_editorState);
                      setHasText(_editorState.getCurrentContent().hasText());
                    }}
                    onBlur={() => setExpandMedia(false)}
                    onFocus={() => setExpandMedia(true)}
                    pluginsConfig={{
                      mention: {
                        onMention(e) {
                          if (e.currentTarget) setMentionEvent(e);
                          else setMentionEvent({});
                        },
                      },
                      emoji: {
                        picker: {
                          open: Boolean(emoticon),
                          anchorEl: emoticon,
                        },
                        preset: {},
                      },
                    }}
                    // onChange={(state) => setEditorState(state)}
                    // editorState={editorState}
                    ref={editorRef}
                  /> */}
                  <IconButton
                    variant="icon"
                    sx={{
                      alignSelf: "flex-end",
                      display: "none",
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
              </>
            )}
            <Box
              sx={{
                border: "2px solid purple",
                flex: "0 0 auto",
              }}
            >
              {/* work in progress... */}
              {true ? (
                <IconButton
                  variant="icon"
                  onClick={debounce_leading(sendMsg)}
                  disabled={!hasMsg}
                >
                  <Send />
                </IconButton>
              ) : (
                <>
                  {openRecorder ? (
                    <IconButton
                      onClick={() => setRetrieveAudioData(true)}
                      variant="icon"
                    >
                      <Send />
                    </IconButton>
                  ) : (
                    <IconButton
                      variant="icon"
                      onClick={() => setOpenRecorder(true)}
                    >
                      <MicNoneOutlined />
                    </IconButton>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
}

Chat.propTypes = {};

export default Chat;
