import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { detectURL, getTextAtCursorPos } from "../utils";

function Link(props) {
  const { decoratedText, children } = props;
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <a
      target="_blank"
      href={decoratedText}
      style={{ color: "yellow" }}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

Link.propTypes = {};

export default Link;
