import { EditorState, Modifier } from "draft-js";
import { forceSelection } from "../../Modifiers";
import { getTextAtCursorPos, getWordAtSelection } from "../../utils";

export const detectURL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const getMatchText = (editorState, t, regex = detectURL) => {
  let { start, end, match } = getWordAtSelection(editorState);
  // reset regex to starting point;
  detectURL.lastIndex = -1;
  const f = detectURL.test(match);
  if (!f) return;
  return {
    start,
    match,
    end,
  };
};
