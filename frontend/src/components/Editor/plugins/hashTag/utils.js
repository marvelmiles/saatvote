import { getWordAtSelection } from "../../utils";

export const detectHashtag = /(?:\s|^)(#[\w]+\b)/gi;

export const getMatchText = (editorState, regex = detectHashtag) => {
  let { start, end, match } = getWordAtSelection(editorState);
  // reset regex to starting point;
  detectHashtag.lastIndex = -1;
  const f = detectHashtag.test(match);
  console.log(f, match, "hash match...");
  if (!f) return;
  return {
    start,
    match,
    end,
  };
};
