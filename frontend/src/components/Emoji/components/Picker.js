import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Picker as Pikr } from "emoji-mart";
import { Popper } from "@mui/material";
import { ResizeEffect } from "../../detect-window-resize";
import { addEmoji } from "../Modifiers";

function Picker({
  anchorEl,
  open,
  onClick,
  container,
  getEditorState,
  setEditorState,
  setState: setStates,
}) {
  const [state, setState] = useState({ picker: { height: "100%" } });
  return (
    <>
      <ResizeEffect
        onEffect={(data) => {
          setState({
            ...state,
            picker: data.node,
          });
        }}
        resizeData={{
          node: {
            width: 350,
            height: 500,
            hp: 80,
          },
        }}
        resizeNode={document.querySelector(".emoji-mart")}
      >
        <Popper
          keepMounted
          // container={container}
          disablePortal
          open={open}
          anchorEl={anchorEl}
          placement="top"
          style={{
            width: "100%",
            zIndex: 2000,
          }}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 25],
              },
            },
          ]}
        >
          <Pikr
            set="apple"
            emojiSize={24}
            style={{
              width: "98%",
              height: "100%",
            }}
            showSkinTones={true}
            showPreview={true}
            onClick={(emoji) => {
              setEditorState(
                addEmoji(getEditorState(), emoji.native, emoji),
                "EMOJI"
              );
            }}
            title=""
          />
        </Popper>
      </ResizeEffect>
    </>
  );
}

Picker.propTypes = {};

export default Picker;
