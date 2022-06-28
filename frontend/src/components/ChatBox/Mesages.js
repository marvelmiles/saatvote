import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { animated } from "react-spring";
import { range } from "../../helpers";
import { LoadingBall } from "../Progress";
import { Avatar, Stack, Typography } from "@mui/material";
import { Check, QueryBuilder } from "@mui/icons-material";
import { useContext } from "../../provider";
import { handleCancelRequest } from "../../api/axios";
import axios from "axios";
import { cipherIv } from "../../helpers";
import { getStateFromRaw } from "../Editor/utils";
import Input from "../Editor/_Input";
// <Box
// sx={{
//   width: "95%",
//   maxWidth: "300px",
//   border: "1px solid purple",
//   display: "flex",
//   mt: 3,
//   alignSelf: ownMessage ? "flex-end" : "flex-start",
//   flexDirection: ownMessage ? "row-reverse" : "row",
//   ...animationStyle,
// }}
// >
// <Avatar
//   sx={{
//     width: "25px",
//     height: "25px",
//     mx: "5px",
//     alignSelf: "flex-end",
//   }}
// />
// <Box
//   sx={{
//     p: "8px",
//     border: "1px solid orange",
//     borderRadius: "16px",
//     ...(ownMessage
//       ? { borderBottomRightRadius: "0" }
//       : { borderBottomLeftRadius: "0" }),
//   }}
// >
//   <Typography component="div">NEst deserunt Aute</Typography>
//   {/* <LoadingBall /> */}
//   <Box sx={{ position: "relative" }}>
//     <Box
//       sx={{
//         position: "absolute",
//         width: "90px",
//         bottom: "-30px",
//         ...(ownMessage ? { right: -35 } : { left: -15 }),
//       }}
//     >
//       <Typography component="span">14:34 am</Typography>
//       {/* <Check /> */}
//       {/* <Check sx={{ position: "relative", left: "-8px" }} /> */}
//       <QueryBuilder
//         sx={{ position: "relative", top: "2px", left: "1px" }}
//       />
//     </Box>
//   </Box>
// </Box>
// </Box>

const getEventStyle = (event = "typing") => {
  switch (event) {
    case "typing":
      return {
        "&::before": {
          border: "none",
          animationDelay: ".15s",
        },
        "& span": {
          display: "block",
          fontSize: 0,
          width: "20px",
          height: "10px",
          position: "relative",
          "&::before": {
            marginLeft: "-7px",
          },
        },
      };
    default:
      return {};
  }
};

const Message = ({ ownMessage, msgObj, decryptMsg, passphrase }) => {
  if (!msgObj.decrypted) {
    msgObj = decryptMsg(msgObj, passphrase);
  }
  if (!msgObj.decrypted) return <Box>not decrypted</Box>;
  return (
    <Typography
      sx={{
        color: ownMessage ? "red" : "pink",
      }}
    >
      {msgObj.content}
    </Typography>
  );
};

function Mesages({ decryptMsg, user, chat, passphrase, getComputedSecret }) {
  const [chats, setChats] = useState([]);
  const { socket } = useContext();
  if (socket.disconnected) socket.connect();
  passphrase = getComputedSecret(true);
  useEffect(() => {
    socket.on("new-message", (msg) => {
      if (
        user.pbkHash === msg.receiverPbkHash ||
        user.pbkHash === msg.senderPbkHash ||
        chat.pbkHash === msg.senderPbkHash ||
        chat.pbkHash === msg.receiverPbkHash
      )
        updateChats(msg);
    });
  }, [socket, chat, user]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const _chats = (await axios.get(`/chats/${channelId}`)).data;
  //       if (socket.connected && _chats?.length) updateChats(_chats);
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   })();
  //   console.log("cahts...");
  //   return () => {
  //     handleCancelRequest(`/chats${channelId}`);
  //   };
  // }, [socket, channelId]);

  const updateChats = (msg) => {
    setChats((prev) => prev.concat(msg));
  };

  return (
    <>
      <Box
        sx={{
          flex: "1 1 auto",
          height: "100%",
          overflow: "auto",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {chats.length === 0 ? (
          <Box>
            No messages yet. <span>Say hello!</span>
          </Box>
        ) : (
          chats.map((msg, i) => (
            <Message
              key={i}
              {...msg}
              msgObj={msg}
              decryptMsg={decryptMsg}
              ownMessage={msg.pbkHash === user.pbkHash}
              passphrase={passphrase}
            />
          ))
        )}
      </Box>
    </>
  );
}
Mesages.propTypes = {};

const animationStyle = {
  transform: "scale(0)",
  transformOrigin: "0 0",
  animation: "bounce 500ms linear both",
  "@keyframes bounce": {
    "0%": {
      transform: "matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "4.7%": {
      transform:
        "matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "9.41%": {
      transform:
        "matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "14.11%": {
      transform:
        "matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "18.72%": {
      transform:
        "matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "24.32%": {
      transform:
        "matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "29.93%": {
      transform:
        "matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "35.54%": {
      transform:
        "matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "41.04%": {
      transform:
        "matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "52.15%": {
      transform:
        "matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "63.26%": {
      transform:
        "matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "85.49%": {
      transform:
        "matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
    "100%": {
      transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    },
  },
};

export default Mesages;
