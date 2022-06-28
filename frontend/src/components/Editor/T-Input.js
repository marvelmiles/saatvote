import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CompositeDecorator, Editor, EditorState, Modifier } from "draft-js";
import emojiToolkit, {
  shortnameToImage,
  toShort,
  emojiList,
  shortnameToUnicode,
} from "emoji-toolkit";
import { Emoji as Emo, Picker } from "emoji-mart";
import data from "emojibase-data/en/compact.json";
// import { compact } from "lodash";
// Filtering out all non printable characters.
// All the printable characters of ASCII are conveniently in one continuous range
function escapeNonASCIICharacters(str) {
  return str.replace(/[^ -~]+/g, "");
}

const createEmojisFromStrategy = () => {
  const emojis = {};
  // console.log(shortnameToImage(toShort(data[26].unicode)));
  for (const item of data) {
    const shortName = toShort(item.unicode);
    const emoji = emojiList[escapeNonASCIICharacters(shortName)];
    if (emoji) {
      if (!emojis[emoji.category]) {
        emojis[emoji.category] = {};
      }
      emojis[emoji.category][shortName] = [shortName];

      if (item.skins) {
        for (const skin of item.skins) {
          const skinShortName = toShort(skin.unicode);
          if (emojiList[skinShortName]) {
            emojis[emoji.category][shortName].push(skinShortName);
          }
        }
      }
    }
  }
  return emojis;
};

const escapedFind = emojiToolkit.escapeRegExp(emojiToolkit.unicodeCharRegex());
const search = new RegExp(
  `<object[^>]*>.*?</object>|<span[^>]*>.*?</span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|(${escapedFind})`,
  "gi"
);
export function findWithRegex(regex, contentBlock, callback) {
  // Get the text from the contentBlock
  const text = contentBlock.getText();
  let matchArr;
  let start;
  // Go through all matches in the text and return the indizes to the callback
  while ((matchArr = regex.exec(text)) !== null) {
    if (matchArr.index === regex.lastIndex) {
      // eslint-disable-next-line no-param-reassign
      regex.lastIndex += 1;
    }
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const emojiStrategy = (contentBlock, callback) =>
  findWithRegex(search, contentBlock, callback);

const Decorated = ({ children }) => {
  const n = Math.floor((Math.random() / 3) * 100);
  const shortName = toShort(data[n].unicode);
  console.log(shortName);
  const imgTag = shortnameToImage(shortName);
  const path = /src="(.*)"/.exec(imgTag)?.[1];
  if (!path) return <span title="dddd">{children}</span>;
  const backgroundImage = `url(${path})`;
  return (
    <span
      title="shortname"
      style={{
        backgroundImage,
        backgroundRepeat: "no-repeat",
        display: "inline-block",
        overflow: "hidden",
        maxWidth: "1.95ch",
        maxheight: "1em",
        backgroundPosition: "center",
        backgroundSize: "contain",
        verticalAlign: "middle",
      }}
      className="emo"
    >
      {children}
    </span>
  );
};

function Input(props) {
  const decorator = new CompositeDecorator([
    {
      strategy: emojiStrategy,
      component: Decorated,
    },
  ]);
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );
  useEffect(() => {
    createEmojisFromStrategy();
  }, []);
  const onChange = (_editorState) => setEditorState(_editorState);
  return (
    <>
      {/* <Picker
        title="Pick your emoji…"
        emoji="point_up"
        onSelect={(d) => {
          console.log(d.short_names, "tyuiiop");
        }}
      /> */}
      <button
        onClick={() => {
          const emoji = shortnameToUnicode(":cat:");
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            "EMOJI",
            "IMMUTABLE",
            { emojiUnicode: emoji }
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const currentSelectionState = editorState.getSelection();

          let emojiAddedContent;
          let emojiEndPos = 0;
          let blockSize = 0;
          const mode = "insert";
          switch (mode) {
            case "insert": {
              // in case text is selected it is removed and then the emoji is added
              const afterRemovalContentState = Modifier.removeRange(
                contentState,
                currentSelectionState,
                "backward"
              );

              // deciding on the position to insert emoji
              const targetSelection =
                afterRemovalContentState.getSelectionAfter();

              emojiAddedContent = Modifier.insertText(
                afterRemovalContentState,
                targetSelection,
                emoji,
                undefined,
                entityKey
              );

              emojiEndPos = targetSelection.getAnchorOffset();
              const blockKey = targetSelection.getAnchorKey();
              blockSize = contentState.getBlockForKey(blockKey).getLength();

              break;
            }

            // case "replace": {
            //   const { begin, end } = getSearchText(editorState, currentSelectionState);

            //   // Get the selection of the :emoji: search text
            //   const emojiTextSelection = currentSelectionState.merge({
            //     anchorOffset: begin,
            //     focusOffset: end,
            //   });

            //   emojiAddedContent = Modifier.replaceText(
            //     contentState,
            //     emojiTextSelection,
            //     emoji,
            //     undefined,
            //     entityKey
            //   );

            //   emojiEndPos = end;
            //   const blockKey = emojiTextSelection.getAnchorKey();
            //   blockSize = contentState.getBlockForKey(blockKey).getLength();

            //   break;
            // }

            default:
              throw new Error('Unidentified value of "mode"');
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
          const ty = EditorState.forceSelection(
            newEditorState,
            emojiAddedContent.getSelectionAfter()
          );
          onChange(ty);
        }}
      >
        insert
      </button>
      <Editor onChange={onChange} editorState={editorState} />{" "}
    </>
  );
}

Input.propTypes = {};

export default Input;
