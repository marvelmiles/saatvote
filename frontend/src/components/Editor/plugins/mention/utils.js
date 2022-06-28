import { EditorState, Modifier } from "draft-js";
import { getTextAtCursorPos } from "../../utils";

const _state = {};

const filterUndefineds = (value) => {
  return value !== undefined;
};

export const detectMentionAt = (regex, text, block) => {
  let matchArr, keywordPos;
  regex = /@[a-zA-Z]*$/g;
  if ((matchArr = regex.exec(text)) !== null) {
    keywordPos = matchArr.index || 0;
  }
  return {
    start: keywordPos,
    end: text.length,
    keyword: keywordPos !== undefined ? text[keywordPos] : "",
    mention: text.slice(keywordPos + 1),
    blockEnd: block.getLength(),
  };
};

export const decodeOffsetKey = (offsetKey) => {
  const [blockKey, decoratorKey, leafKey] = offsetKey.split("-");
  return {
    blockKey,
    decoratorKey: parseInt(decoratorKey, 10),
    leafKey: parseInt(leafKey, 10),
  };
};

export const getDecorationForMention = (
  editorState,
  searches,
  mentionTriggers
) => {
  // get the current selection
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset();
  // the list should not be visible if a range is selected or the editor has no focus
  if (!selection.isCollapsed() || !selection.getHasFocus()) {
    return null;
  }
  // const offsetDetails = [];
  // searches.forEach((offsetKey) => {
  //   offsetDetails.push(decodeOffsetKey(offsetKey.offsetKey));
  // });

  const offsetDetails = searches.map((off) => decodeOffsetKey(off.offsetKey));

  // a leave can be empty when it is removed due event.g. using backspace
  // do not check leaves, use full decorated portal text
  const leaves = offsetDetails
    .filter((offsetDetail) => offsetDetail.blockKey === anchorKey)
    .map((offsetDetail) =>
      editorState
        .getBlockTree(offsetDetail.blockKey)
        .getIn([offsetDetail.decoratorKey])
    );
  // if all leaves are undefined the popover should be removed
  if (leaves.every((leave) => leave === undefined)) return null;
  // Checks that the cursor is after the @ character but still somewhere in
  // the word (search term). Setting it to allow the cursor to be left of
  // the @ causes troubles due selection confusion.
  const blockText = editorState
    .getCurrentContent()
    .getBlockForKey(anchorKey)
    .getText();

  const triggerForSelectionInsideWord = leaves
    .filter(filterUndefineds)
    .map(
      ({ start, end }) =>
        mentionTriggers
          .map((trigger) =>
            // @ is the first character
            (start === 0 &&
              anchorOffset >= start + trigger.length && //should not trigger if the cursor is before the trigger
              blockText.substr(0, trigger.length) === trigger &&
              anchorOffset <= end) ||
            // @ is in the text or at the end, multi triggers
            (mentionTriggers.length > 1 &&
              anchorOffset >= start + trigger.length &&
              (blockText.substr(start + 1, trigger.length) === trigger ||
                blockText.substr(start, trigger.length) === trigger) &&
              anchorOffset <= end) ||
            // @ is in the text or at the end, single trigger
            (mentionTriggers.length === 1 &&
              anchorOffset >= start + trigger.length &&
              anchorOffset <= end)
              ? trigger
              : undefined
          )
          .filter(filterUndefineds)[0]
    )
    .filter(filterUndefineds);
  if (triggerForSelectionInsideWord.isEmpty()) return null;

  const [activeOffsetKey, activeTrigger] = triggerForSelectionInsideWord
    .entrySeq()
    .first();
  return {
    ...decodeOffsetKey(activeOffsetKey),
    activeOffsetKey,
    activeTrigger,
    element: searches.get(activeOffsetKey)?.decoratedElement,
  };
};

export const getSearchTextAt = (editorState, triggers) => {
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(anchorKey);
  const blockText = currentBlock.getText();
  const text = blockText.substr(0, anchorOffset);
  // escapeRegExp(trigger)
  // fixing issue with a nasty hack... fix later
  const triggerPattern = triggers.map((trigger) => trigger).join("|");

  const TRIGGER_REGEX = new RegExp(`(\\s|^)(${triggerPattern})`, "g");

  const matches = text.matchAll(TRIGGER_REGEX);

  let triggerStartIndex = 0;
  let valueStartIndex = 0;

  for (const match of matches) {
    const spaceLen = match[1].length;
    const matchLen = match[2].length;

    triggerStartIndex = (match.index || 0) + spaceLen;
    valueStartIndex = triggerStartIndex + matchLen;
  }
  if (text[triggerStartIndex] !== "@") return null;

  const matchingString = text.slice(valueStartIndex);
  const end = text.length;

  return {
    begin: triggerStartIndex,
    end,
    matchingString,
    mention: matchingString,
  };
};

export const searchChange = (
  editorState,
  activeOffsetKey,
  lastActiveOffsetKey,
  trigger,
  api = {},
  onSearchChange
) => {
  const { matchingString: searchValue } = getSearchTextAt(editorState, [
    trigger,
  ]);

  if (
    _state.lastActiveTrigger !== trigger ||
    _state.lastSearchvalue !== searchValue ||
    lastActiveOffsetKey !== activeOffsetKey
  ) {
    _state.lastActiveTrigger = trigger;
    _state.lastSearchvalue = searchValue;
    api.searchValue = searchValue;
    onSearchChange(api);
  }
};
