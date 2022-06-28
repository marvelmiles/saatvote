import { EditorState, Modifier } from "draft-js";
import { forceSelection } from "../../Modifiers";
import { getTextAtCursorPos } from "../../utils";
import { detectMentionAt, getSearchTextAt } from "./utils";

export const addMention = (type, editorState, regex, suggestion) => {
  // const { start, end, blockEnd } = getTextAtCursorPos(
  //   editorState,
  //   ({ text, block }) => {
  //     const ty = detectMentionAt(regex, text, block);
  //     console.log(ty, "ioo");
  //     return ty;
  //   }
  // );

  // for some weird reason :( editorState cursor position jump to start.
  //  applying a collapsed selection correct this behaviour.
  const { begin: start, end, blockEnd } = getSearchTextAt(editorState, ["@"]);
  editorState = forceSelection(editorState, {
    anchorOffset: end,
    focusOffset: end,
  });
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    "mention",
    "MUTABLE",
    {
      suggestion,
    }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  // updating selection range
  const mentionSelection = editorState.getSelection().merge({
    anchorOffset: start,
    focusOffset: end,
  });
  let modifiedContent = Modifier.replaceText(
    contentState,
    mentionSelection,
    suggestion,
    editorState.getCurrentInlineStyle(),
    entityKey
  );
  // adding extra space if mention is at the end of the block... to improve
  // user experience.
  // const blockKey = mentionSelection.getAnchorKey();
  // const blockSize = editorState
  //   .getCurrentContent()
  //   .getBlockForKey(blockKey)
  //   .getLength();
  if (blockEnd === end) {
    modifiedContent = Modifier.insertText(
      modifiedContent,
      modifiedContent.getSelectionAfter(),
      " "
    );
  }
  // applies modifiedContent as new currentContent
  editorState = EditorState.push(
    editorState,
    modifiedContent,
    "insert-fragment"
  );
  return EditorState.forceSelection(
    editorState,
    modifiedContent.getSelectionAfter()
  );
};
