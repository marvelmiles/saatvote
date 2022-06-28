import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { forceSelection } from "../../../Modifiers";
function Link(props) {
  const propsRef = useRef(props);
  // useEffect(() => {
  //   const props = propsRef.current;
  //   if (props.entityKey) {
  //     // Ensures cursor is collapsed and well positioned
  //     // after redo and undo actions.
  //     props.setEditorState(
  //       forceSelection(props.getEditorState(), null, true),
  //       "" // ignores plugins onchange handler
  //     );
  //   }
  // }, []);

  return (
    <span {...props.linkProps} href={props.decoratedText}>
      {props.children}
    </span>
  );
}

Link.propTypes = {};

export default Link;
