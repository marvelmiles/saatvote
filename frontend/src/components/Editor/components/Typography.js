import React from "react";
import PropTypes from "prop-types";

function Typography({ children, component }) {
  const Tag = {
    name: component || "span",
  };
  // eslint-disable-line react/jsx-pascal-case
  return <Tag.name style={{ color: "red" }}>{children}</Tag.name>;
}

Typography.propTypes = {};

export default Typography;
