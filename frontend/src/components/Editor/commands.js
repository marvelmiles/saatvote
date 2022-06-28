import { getDefaultKeyBinding, RichUtils } from "draft-js";

export const handleKeyCommand = (command, editorState, v, cb = () => {}) => {
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    cb && cb(newState);
    return "handled";
  }
  return "not-handled";
};

export const mapKeyToEditorCommand = (e, editorState, cb = () => {}) => {
  if (e.keyCode === 9 || e.key === "Tab") {
    const newState = RichUtils.onTab(e, editorState, 4);
    if (newState !== editorState) cb && cb(newState);
    return;
  }
  return getDefaultKeyBinding(e);
};

export const handleKeyBind = (callbacks = []) => {
  callbacks.push(getDefaultKeyBinding);
  return (e) => {
    let result;
    const handled = callbacks.some((cb) => {
      result = cb(e);
      return result !== undefined;
    });
    return handled ? result : null;
  };
};
