import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { applyLink, applyLinkEntity, removeLinkEntity } from "../Modifier";
import { forceSelection } from "../../../Modifiers";
import { getEntityAtCurrentSelection, getMatchText } from "../utils";
import { Api } from "@mui/icons-material";

function Link({ children, linkProps, decoratedText, ...args }) {
  const c = useRef({});
  const t = getMatchText(args.getEditorState(), "uglifyy").start;
  useEffect(() => {
    console.log("link new....", c.current);
    const entity = getEntityAtCurrentSelection(
      args.getEditorState(),
      args.entityKey
    );

    if (c.current.t && c.current.s) {
      console.log("loveable,,,");
      args.setEditorState(
        removeLinkEntity(args.getEditorState(), entity)
        // "PLAIN"
      );
      c.current.t = false;
    }
    if (!c.current.s) {
      if (args.entityKey) {
        console.log(entity, "deco");
        args.setEditorState(
          forceSelection(args.getEditorState(), entity, true)
          // "PLAIN"
        );
        c.current.s = args.entityKey;
      }
    }
    return () => {
      console.log("remove effect");
    };
  }, [args]);
  if (t === undefined) {
    console.log("uglify link...");
    c.current.t = true;
    return children;
  }
  console.log("world cup");
  c.current.t = false;
  return (
    <a {...linkProps} href={decoratedText}>
      {children}
    </a>
  );
}

Link.propTypes = {};

export default Link;
