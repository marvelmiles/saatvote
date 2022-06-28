import { EditorState, RichUtils, SelectionState } from "draft-js";
import { createDecorator, detectURL, findEntityAndDecorate } from "../../utils";
import Link from "./components/Link";
import {
  applyLink,
  applyLinkEntity,
  removeLink,
  removeLinkEntity,
  replaceTextWith,
} from "./Modifier";
import {
  getMatchText,
  getEntities,
  getEntityAtCurrentSelection,
} from "./utils";
import { Modifier } from "draft-js";
import { forceSelection } from "../../Modifiers";
import utils, { getSelectionEntity, getEntityRange } from "draftjs-utils";
const _setOptions = (options = {}) => {
  return options;
};
const _state = {};

export const createLinkifyPlugin = (options = {}) => {
  let { ...linkProps } = options;
  const DecoratedText = (props) => {
    linkProps = {
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: "yellow",
      },
      ...linkProps,
    };
    return <Link {...props} {...api} linkProps={linkProps} />;
  };
  const api = {
    getTextRange(key) {
      return _state[key];
    },
  };
  return {
    key: "LINK",
    decorators: [
      {
        strategy: (block, cb, contentState) => {
          block.findEntityRanges(
            (ch) => {
              const key = ch?.getEntity?.();
              console.log("startegy....");
              let isType;
              if (key) {
                const type = contentState.getEntity(key).getType();
                console.log("strategy type", type);
                isType = type === "LINK";
              }
              _state.isType = isType;

              return isType;
            },
            (start, end) => cb(start, end)
          );
        },
        component: DecoratedText,
      },
    ],
    init(handlers) {
      for (let k in handlers) {
        api[k] = handlers[k];
      }
    },
    onChange(editorState) {
      const textRange = getMatchText(editorState);
      const start = textRange.start;
      const match = textRange.match;
      const end = textRange.end;
      // const entity = getEntityAtCurrentSelection(editorState);
      const entity = getSelectionEntity(editorState);
      console.log(match, start, end, entity);
      _state["-" + start + "-" + end] = textRange;
      if (start >= 0) {
        if (!entity) {
          editorState = applyLinkEntity(editorState, textRange);
        }
      } else if (entity) {
        const range = getEntityRange(editorState, entity);
        console.log("remoinvg..", range);
        // editorState = replaceTextWith(editorState, range.text);
        // editorState = removeLinkEntity(editorState, range);

        _state.lr = entity;
      }

      return editorState;
    },
  };
};
