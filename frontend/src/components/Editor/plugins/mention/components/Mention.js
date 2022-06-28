import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";

export const InlineMention = ({ initMethods, api, children, offsetKey }) => {
  const nodeRef = useRef();
  useEffect(() => {
    api.register(offsetKey, {
      offsetKey,
      decoratedElement: nodeRef.current,
    });
    initMethods.setEditorState(initMethods.getEditorState(), "mention");
    return () => {
      api.unregister(offsetKey);
    };
  }, [api, initMethods, offsetKey]);

  return (
    <span ref={nodeRef} style={{ color: "green" }}>
      {children}
    </span>
  );
};

const Mention = (props) => (
  <>
    <span style={{ color: "pink" }} title={props.mention || ""}>
      {props.children}
    </span>
  </>
);

Mention.propTypes = {};
export default Mention;
