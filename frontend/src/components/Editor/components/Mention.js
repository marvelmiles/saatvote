import React from "react";
import PropTypes from "prop-types";

function Mention(props) {
  return (
    <>
      <span style={{ color: "pink" }} title={props.mention || ""}>
        {props.children}
      </span>
    </>
  );
}

Mention.propTypes = {};

export default Mention;
