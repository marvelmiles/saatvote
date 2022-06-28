import Typography from "./components/Typography";
import { detectHashtag, getMatchText } from "./utils";
import { getSelectionEntity, getEntityRange } from "draftjs-utils";
import { applyHashTagEntity, removeHashTagEntity } from "./Modifier";
import { forceSelection } from "../../Modifiers";
import {
  getEntities,
  getEntity,
  getTextAtCursorPos,
  getWordAtSelection,
} from "../../utils";
const _setOptions = (options = {}) => {
  return options;
};
const _state = {};
export const createHashTagPlugin = (options = {}) => {
  let api = {
    getRange(t) {
      if (t) {
        const d = api.getEditorState();
        const f = getMatchText(d);
        console.log(f, _state.range, t, "ranger................");
        !f && api.setEditorState(removeHashTagEntity(d), "");
      }
      return _state.range || {};
    },
  };
  const DecoratedText = (props) => {
    return <Typography {...props} {...api} />;
  };
  return {
    decorators: [
      {
        strategy: (block, cb, contentState) => {
          console.log("hash strategy...");
          const text = block.getText();
          block.findEntityRanges(
            // (ch) => {
            //   const key = ch?.getEntity?.();
            //   let isType;
            //   if (key) {
            //     const type = contentState.getEntity(key).getType();
            //     isType = type === "HASHTAG";
            //   }
            //   _state.isType = isType;
            //   return isType;
            // },
            () => true,
            // (start, end) => cb(start, end)
            (start, end) => {
              const regex = /(?:^|\s+)(#[\w]+)/gi;
              let matchArr;
              while ((matchArr = regex.exec(text)) !== null) {
                start = matchArr.index;
                end = matchArr[0].length + start;
                _state.range = { start, end };
                cb(start, end);
                console.log("while decorator...");
              }
              // cb(start, end);
              console.log(start, end, text, "decorator cb...");
            }
          );
        },
        component: DecoratedText,
      },
    ],

    onChange(editorState) {
      const textRange = getMatchText(editorState);
      const entity = getEntity(editorState);
      console.log(
        getTextAtCursorPos(editorState).text,
        textRange?.start,
        _state.l,
        entity?.entityKey,
        "hash chnae matcher....."
      );
      if (textRange && !entity ) {
        editorState = applyHashTagEntity(
          editorState,
          textRange,
          {
            title: textRange.match,
          },
          (key) => {
            _state.l = key;
            console.log("APPLlied key.............", key);
          }
        );
      } else if (entity && _state.l && !textRange) {
        console.log("removieddddddddd ashajsjsj");
        editorState = removeHashTagEntity(editorState);
        _state.l = undefined;
      }
      return editorState;
    },

    withEffect(handlers) {
      for (let k in handlers) {
        api[k] = handlers[k];
      }
    },
  };
};
