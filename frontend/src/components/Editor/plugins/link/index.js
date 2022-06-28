import { EditorState, RichUtils, SelectionState } from "draft-js";
import { createDecorator, findEntityAndDecorate, getEntity } from "../../utils";
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
  detectURL,
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
              let isType;
              if (key) {
                const type = contentState.getEntity(key).getType();
                isType = type === "LINK";
              }
              _state.isType = isType;

              return isType;
            },
            (start, end) => {
              console.log("decorator cb link", start, end);
              cb(start, end);
            }
          );
        },
        component: DecoratedText,
      },
    ],
    withEffect(handlers) {
      for (let k in handlers) {
        api[k] = handlers[k];
      }
    },
    /**
     * @param {EditorState} editorState
     * @returns {EditorState} editorState
     */
    onChange(editorState) {
      if (editorState.getSelection().isCollapsed()) {
        const textRange = getMatchText(editorState);
        const entity = getEntity(editorState);
        if (textRange && !entity)
          editorState = applyLinkEntity(editorState, textRange, {
            url: textRange.match,
          });
        else if (!textRange && entity && entity.entity.getType() === "LINK")
          editorState = removeLinkEntity(editorState, entity);
      }
      return editorState;
    },
  };
};
