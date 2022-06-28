import { EditorState, Modifier } from "draft-js";

export const Mode = {
  INSERT: "INSERT", // insert emoji to current cursor position
  REPLACE: "REPLACE", // replace emoji shortname
};

export const addEmoji = (editorState, text, data, mode = Mode.INSERT) => {
  //   const emoji = shortname;
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    "EMOJI",
    "IMMUTABLE",
    data
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const currentSelectionState = editorState.getSelection();

  let emojiAddedContent;
  let emojiEndPos = 0;
  let blockSize = 0;

  switch (mode) {
    case Mode.INSERT: {
      // in case text is selected it is removed and then the emoji is added
      const afterRemovalContentState = Modifier.removeRange(
        contentState,
        currentSelectionState,
        "backward"
      );

      // deciding on the position to insert emoji
      const targetSelection = afterRemovalContentState.getSelectionAfter();

      emojiAddedContent = Modifier.insertText(
        afterRemovalContentState,
        targetSelection,
        text,
        undefined,
        entityKey
      );

      emojiEndPos = targetSelection.getAnchorOffset();
      const blockKey = targetSelection.getAnchorKey();
      blockSize = contentState.getBlockForKey(blockKey).getLength();

      break;
    }
    default:
      break;
  }
  // If the emoji is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  if (emojiEndPos === blockSize) {
    emojiAddedContent = Modifier.insertText(
      emojiAddedContent,
      emojiAddedContent.getSelectionAfter(),
      " "
    );
  }

  const newEditorState = EditorState.push(
    editorState,
    emojiAddedContent,
    "insert-fragment"
  );
  return EditorState.forceSelection(
    newEditorState,
    emojiAddedContent.getSelectionAfter()
  );
};
