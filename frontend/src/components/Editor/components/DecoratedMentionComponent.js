import React, { useEffect } from "react";
import PropTypes from "prop-types";

function DecoratedMentionComponent({ children }) {
  return <span style={{ color: "green" }}>{children}</span>;
}

DecoratedMentionComponent.propTypes = {};

export default DecoratedMentionComponent;
