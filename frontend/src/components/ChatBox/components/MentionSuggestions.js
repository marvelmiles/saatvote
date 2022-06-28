import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { addMention } from "../../Editor/plugins/mention/modifiers";

function MentionSuggestions({
  mentionEvent,
  suggestions = [],
  onAddMention = () => {},
  onClickAway = () => {},
  suggestionFilter,
  open = false,
}) {
  const { mention, trigger, getEditorState, getOptions, setEditorState, key } =
    mentionEvent;
  const suggest = suggestionFilter
    ? suggestionFilter(suggestions, mention, trigger)
    : mention
    ? suggestions.filter((item) => new RegExp(mention, "gi").test(item))
    : suggestions;
  const listRef = useRef();
  const stateRef = useRef({});
  if (!Array.isArray(suggest)) return null;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: open ? "200px" : "0px",
          border: "1px solid pink",
          transform: "translateY(-100%)",
          transition: "height ease-in-out 500ms",
          overflow: "hidden",
        }}
      >
        <ClickAwayListener onClickAway={() => {}}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "yellow",
              overflowY: "auto",
            }}
            ref={listRef}
          >
            {suggest.map((suggestion, i) => (
              <p
                style={{
                  width: "100%",
                  height: "50px",
                  my: 2,
                  border: "1px solid red",
                }}
                key={i}
                onMouseDown={(e) => {
                  // prevent on search change and keep focus
                  // in some cases clicking the element fire event multiple time
                  // to avoid this on mouse up perform main logic
                  e.preventDefault();
                  stateRef.current.mouseDown = true;
                }}
                onMouseUp={() => {
                  if (stateRef.current.mouseDown) {
                    setEditorState(
                      addMention(
                        `${trigger}Mention`,
                        getEditorState(),
                        getOptions().regex,
                        suggestion
                      ),
                      key
                    );
                    onAddMention();
                  }
                }}
              >
                {suggestion}
              </p>
            ))}
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
}

MentionSuggestions.propTypes = {};

export default MentionSuggestions;
