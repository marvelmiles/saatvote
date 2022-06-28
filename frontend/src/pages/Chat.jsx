import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { cipherIv, createECDH, getCookie, setCookie } from "../helpers";
import { useNavigate } from "react-router-dom";
import { useContext } from "../provider";
import axios, { handleCancelRequest } from "../api/axios";
/**
 *
 * @note Chat component stil in progress. Having issue with draft entities redo and undo, entity serilization
 * and deserilization. Majority of the chat features work but in a big comment mess :)
 * (Slate|draft)-* files are also important for now.
 */
function Chat(props) {
  const { isLogin, jwtToken, user } = getCookie();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const { socket, connectSocket } = useContext();
  const [chatmate, setChatMate] = useState(null);
  if (!socket.connected) socket.connect();
  // const userECDH = createECDH(cipherIv().decrypt(user.privateKeyCipher));

  useEffect(() => {
    console.log(isLogin, jwtToken, "islogn..");
    if (!isLogin) navigate(`/u/login?redirect_url=chat`);
    // getConv
    (async () => {
      try {
        const res = (
          await axios.get("/user/conversations", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
        ).data;
        console.log(res);
        setConversations(res);
      } catch (err) {
        console.log(err.response?.data, err.message, "conversations error");
      }
    })();
    return () => {
      handleCancelRequest();
    };
  }, [isLogin, navigate, jwtToken]);
  const handleSelectedChannel = (conversation, e) => {
    console.log(conversations);
  };
  return (
    <>
      <h1>Current user: </h1>
      <h1>conversations</h1>
      {conversations.map((conv, i) => (
        <h4 onClick={handleSelectedChannel.bind(this, conv)} key={i}>
          {conv.name}
        </h4>
      ))}
      {chatmate && <ChatBox chatmate={chatmate} />}
    </>
  );
}

Chat.propTypes = {};

const ChatBox = () => {
  return <></>;
};

export default Chat;
