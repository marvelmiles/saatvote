import React from "react";
import PropTypes from "prop-types";
import { Editor } from "draft-js";

function Editable({ editorState, onChange }) {
  //  onChange = (_es) => setEditorState(_es);
  return (
    <Editor
      onChange={onChange}
      editorState={editorState}
      ref={(node) => {
        this.editor = node;
      }}
    />
  );
}

Editable.propTypes = {};

export default Editable;
