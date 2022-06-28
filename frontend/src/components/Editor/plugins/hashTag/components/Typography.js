import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { forceSelection } from "../../../Modifiers";
import { applyHashTagEntity, removeHashTagEntity } from "../Modifier";
import { getEntity, getWordAtSelection } from "../../../utils";
import { getSelectionEntity } from "draftjs-utils";
function Link(pprops) {
  const propsRef = useRef(pprops);
  const t = useRef();
  const s = useRef();
  // useEffect(() => {
  //   // const props = propsRef.current;
  //   const props = pprops;
  //   // console.log(props.entityKey, "effect key");
  //   let e = props.getEditorState();
  //   if (!props.entityKey && !t.current) {
  //     // Ensures cursor is collapsed and well positioned
  //     // after redo and undo actions.
  //     console.log(e, "typo effect............");
  //     e = applyHashTagEntity(e, props.getRange());
  //     props.setEditorState(e, "");
  //     t.current = true;
  //   }
  //   // // if (!pprops.entityKey) {
  //   //   props.setEditorState(
  //   //     forceSelection(e, null, true),
  //   //     "" // ignores plugins onchange handler
  //   //   );
  //   //   s.current = true;
  //   // }
  //   return () => {
  //     // const e = pprops.getEditorState();
  //     // const entity = getEntity(e);
  //     // const textRange = getWordAtSelection(e);
  //     // console.log(
  //     //   "removed effect...",
  //     //   entity?.entityKey,
  //     //   pprops.entityKey,
  //     //   textRange
  //     // );
  //     // console.log("remove typo effect......", removeHashTagEntity(e));
  //     pprops.getRange(true);
  //   };
  // }, [pprops]);

  return (
    <span
      {...pprops.linkProps}
      style={{ color: "pink" }}
      href={pprops.decoratedText}
    >
      {pprops.children}
    </span>
  );
}

Link.propTypes = {};

export default Link;
