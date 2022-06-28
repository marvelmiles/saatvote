import React from "react";
import PropTypes from "prop-types";
import { Emoji as Emo } from "emoji-mart";
function Emoji({ children, contentState, entityKey, emojiData }) {
  const emoji = emojiData || contentState.getEntity(entityKey).getData();
  return (
    <span
      //   style={{
      //     // opacity: 0,
      //     color: "transparent",
      //     "&:nthChild(2)": {
      //       display: "none",
      //     },
      //   }}
      className="emoji-wrapper"
    >
      {emoji.id && <Emo emoji={emoji} set="apple" size={16} />}
      {children}
    </span>
  );
}

Emoji.propTypes = {};

export default Emoji;
