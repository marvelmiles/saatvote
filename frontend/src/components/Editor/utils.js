import Link from "./components/Link";
import { CompositeDecorator, convertToRaw, convertFromRaw } from "draft-js";
import Typography from "./components/Typography";
import DecoratedMentionComponent from "./components/DecoratedMentionComponent";
import Mention from "./components/Mention";
import { convertToHTML, convertFromHTML } from "draft-convert";
import Emoji from "../Emoji/components/Emoji";
// import { detectURL } from "../../helpers";
import { getSelectionEntity, getEntityRange } from "draftjs-utils";
import { getMatchText } from "./plugins/link/utils";
import draftToHtml from "draftjs-to-html";
export const getWordAtSelection = (editorState, start, end) => {
  const block = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getFocusKey());
  // is integer
  start = start >= 0 ? start : 0;
  end = end >= 0 ? end : block.getLength();
  const text = block.getText();
  const offset = editorState.getSelection().getFocusOffset();
  let _end = offset,
    _start = offset;
  while (_end !== end && text[_end] !== " ") {
    _end++;
  }
  while (_start !== start && text[_start] !== " ") {
    _start--;
  }
  let match = text.slice(_start, _end);
  if (match.startsWith(" ")) {
    _start++;
    match = text.slice(_start, end);
  }
  if (match.endsWith(" ")) {
    _end--;
    match = text.slice(_start, _end);
  }
  return {
    text,
    start: _start,
    end: _end,
    match,
  };
};

export const createDecorator = (regex, Component) => {
  return {
    strategy(contentBlock, callback) {
      const text = contentBlock.getText();
      let matchArr, start;
      while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
      }
    },
    component: Component,
  };
};

export const findEntityAndDecorate = (
  type,
  Component,
  strict = false,
  onEntityRange
) => {
  return {
    strategy: (block, cb, contentState) => {
      block.findEntityRanges(
        (ch) => {
          if (type === "LINK") console.log("link in find..");
          const key = ch.getEntity();
          return strict
            ? !key
            : key !== null && contentState.getEntity(key).getType() === type;
        },
        onEntityRange
          ? (start, end) => onEntityRange(block, contentState, start, end, cb)
          : cb
      );
    },
    component: Component,
  };
};

export const composeDecorators = (plugins = []) => {
  return new CompositeDecorator(
    (() => {
      let decorators = [];
      for (let plug in plugins) {
        plug = plugins[plug];
        Array.isArray(plug.decorators) &&
          (decorators = decorators.concat(plug.decorators));
      }
      return decorators;
    })()
  );
};

export const getTextAtCursorPos = (editorState, getRangeText) => {
  const selection = editorState.getSelection();
  const focusKey = selection.getFocusKey();
  const focusOffset = selection.getFocusOffset();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(focusKey);
  const blockText = currentBlock.getText();
  let text = blockText.slice(0, focusOffset); // get all text b4 cursor

  text = {
    text,
    blockText,
    cursorPos: focusOffset,
    block: currentBlock,
    blockEnd: currentBlock.getLength(),
  };
  if (typeof getRangeText === "function") {
    text = {
      ...text,
      ...getRangeText(text),
    };
  }
  return text;
};

export const getDecoratorLength = (decoratorType) => {
  if (!decoratorType?._decorators) return undefined;
  return decoratorType._decorators.length;
};

export const getRawState = (editorState) => {
  if (!editorState) return "";
  return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
};

export const getStateFromRaw = (rawState) => {
  if (typeof rawState !== "string") return null;
  return convertFromRaw(JSON.parse(rawState));
};

// export const serialize = (editorState) => {
//   const entityTransform = (entity) => {
//     console.log(entity, "entity");
//     return "";
//   };
//   return draftToHtml(
//     convertToRaw(editorState.getCurrentContent()),
//     {
//       trigger: "#",
//       separator: " ",
//     },
//     true,
//     entityTransform
//   );
// };

export const serialize = (editorState) => {
  return convertToHTML({
    styleToHTML: (style) => {
      // console.log(style, "styler");
      if (style === "BOLD") {
        return <span style={{ color: "blue" }} />;
      }
    },
    blockToHTML: (block) => {
      // console.log(block, "blocker");
      if (block.type === "PARAGRAPH") {
        return <p />;
      }
    },
    entityToHTML: (entity, originalText) => {
      console.log(entity, originalText, "submitted entittyyyyy");
      switch (entity.type) {
        case "LINK":
          const start = getMatchText(editorState).start;
          if (start === undefined) {
            console.log("no entity for", entity.data);
            return "jk";
          }
          return (
            <a target="_self" href={entity.data.url}>
              {originalText}
            </a>
          );
        case "EMOJI":
          return <Emoji emojiData={entity.data} />;
        default:
          return originalText;
      }
    },
  })(editorState.getCurrentContent());
};

export const getEntities = (editorState, entityType = "") => {
  const entities = [];
  const content = editorState.getCurrentContent();
  content.getBlocksAsArray().forEach((block) => {
    let selectedEntity = null;
    block.findEntityRanges(
      (character) => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || entity.getType() === entityType) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: content.getEntity(character.getEntity()),
            };
            return true;
          }
          return false;
        }
      },
      (start, end) => entities.push({ ...selectedEntity, start, end })
    );
  });
  return entities;
};

export const getEntity = function (editorState, entityKey = "") {
  return getEntities(editorState).find((entity) => {
    const { start, end } = getWordAtSelection(editorState);
    if (
      entity.entityKey === entityKey ||
      entity.end === end ||
      entity.start === start
    ) {
      console.log("entity found", entity.entityKey);
      return entity;
    }
    console.log("no entity found");
    return null;
  });
};
