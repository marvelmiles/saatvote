import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Emoji, Picker } from "emoji-mart";
import { ClickAwayListener } from "@mui/material";
import { Box } from "@mui/system";
// disable emoji skin buttons
//  working on emoji skin popper  with the popper component
function EmojiMart({ open, onClick, ClickAwayException }) {
  const [_open, _setOpen] = useState();
  const pickerRef = useRef();
  useEffect(() => {
    console.log(open, pickerRef.current, "in emojo");
    _setOpen(open);
  }, [open]);

  return (
    <>
      <Picker
        set="apple"
        style={{
          zIndex: 2,
          position: "absolute",
          top: "50%",
          left: "5px",
          transform: "translateY(-50%)",
          width: "90%",
          height: "50%",
          maxHeight: "300px",
          // border: "5px solid pink",
          display: _open ? "block" : "none",
          marginTop: 50,
        }}
        title=""
        notFoundEmoji="shrug"
        emojiTooltip={false}
        tooltip={false}
        emojiSize={24}
        showSkinTones={true}
        onClick={(emojiData) => {
          const em = (
            <Emoji
              emoji={{ id: emojiData.id, name: emojiData.name }}
              set="apple"
              size={24}
            />
          );
          console.log(em, "emmmy");
          onClick(emojiData, em);
        }}
      />
    </>
  );
}

EmojiMart.propTypes = {};

export default EmojiMart;
