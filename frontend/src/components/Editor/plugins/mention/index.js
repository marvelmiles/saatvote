import { EditorState } from "draft-js";
import { Map as Mapp } from "immutable";
import { useEffect, useRef } from "react";
import {
  createDecorator,
  findEntityAndDecorate,
  getTextAtCursorPos,
} from "../../utils";
import Mention, { InlineMention } from "./components/Mention";
import { findMentionEntity } from "./Strategies";
import { getDecorationForMention, getSearchTextAt } from "./utils";

const _setOptions = (options) => {
  options.keyword = options.keyword || "@";
  options.supportWhiteSpace = options.supportWhiteSpace || false;
  options.regex = options.supportWhiteSpace
    ? options.whiteSpaceReg || new RegExp()
    : options.noWhiteSpaceReg || new RegExp(`${options.keyword}[a-zA-Z]*$`);
  options.onMention = options.onMention || (() => {});
};
const _state = {};

let searches = Mapp();
let escapedSearch;
let clientRectFunctions = Mapp();
let isOpened = false;
let referenceElement;
export const createMentionPlugin = (options = {}) => {
  _setOptions(options);
  const { keyword, regex, ondetectMention } = options;
  const initMethods = {};
  const api = {
    getOptions() {
      return options;
    },
    getAllSearches: () => searches,
    register: (offsetKey, data) => (searches = searches.set(offsetKey, data)),
    unregister: (offsetKey) => {
      searches = searches.delete(offsetKey);
      clientRectFunctions = clientRectFunctions.delete(offsetKey);
    },
    setDecoration(decoration) {
      _state.decoration = decoration;
    },
    getDecoration() {
      return _state.decoration;
    },
    getRangeText() {
      return _state.rangeText;
    },
    setRangeText(rangeText) {
      _state.rangeText = rangeText;
    },
  };
  const DecoratedInlineMention = (props) => {
    return <InlineMention api={api} initMethods={initMethods} {...props} />;
  };
  const DecoratedMention = (props) => {
    return <Mention {...props} />;
  };
  return {
    key: "mention",
    decorators: [
      {
        strategy: findMentionEntity(["@"]),
        component: DecoratedMention,
      },
      findEntityAndDecorate(
        "MENTION",
        DecoratedInlineMention,
        true,
        (block, contentState, nonEntityStart, nonEntityEnd, decorator) => {
          // for now support is only made for mention with no space
          // escapeRegExp
          const triggerPattern = ["@"].map((trigger) => trigger).join("|");
          const HANDLE_REGEX = new RegExp(
            `(^|\\s)${triggerPattern}[\\w]*`,
            "g"
          );
          const text = block.getText();
          let matchArr, start;
          while ((matchArr = HANDLE_REGEX.exec(text)) !== null) {
            start = matchArr.index;
            decorator(start, start + matchArr[0].length);
          }
        }
      ),
    ],

    onChange(state) {
      if (typeof options.onChange === "function")
        return options.onChange(state);
      const searches = api.getAllSearches();
      // if no portal searches exist return
      if (!searches.size) {
        options.onMention({});
        return state;
      }
      const decoration = getDecorationForMention(state, searches, ["@"]);
      const rangeText = getSearchTextAt(state, ["@"]);
      // reset escaped search and return state
      if (!decoration || !rangeText) {
        options.onMention({});
        return state;
      }
      // const rangeText = getTextAtCursorPos(state, ({ text }) => {
      //   const triggerPattern = ["@"].map((trigger) => trigger).join("|");
      //   const triggerIndex = text.lastIndexOf(triggerPattern);
      //   return {
      //     mention: text.slice(triggerIndex + 1),
      //   };
      // });

      const lastActiveOffsetKey = _state.activeOffsetKey;
      _state.activeOffsetKey = decoration.activeOffsetKey;
      if (
        state.lastActiveTrigger !== decoration.activeTrigger ||
        _state.lastMention !== rangeText.mention ||
        decoration.activeOffsetKey !== lastActiveOffsetKey
      ) {
        _state.lastActiveTrigger = decoration.activeTrigger;
        _state.lastMention = rangeText.mention;
        api.currentTarget = decoration.element;
        api.setDecoration(decoration);
        api.setRangeText(rangeText);
        const __handler = {
          key: "mention",
          mention: rangeText.mention,
          currentTarget: decoration.element,
          trigger: decoration.activeTrigger,
          getDecoration: api.getDecoration,
          getRangeText: api.getRangeText,
          getOptions: api.getOptions,
          ...initMethods,
        };
        options.onMention(__handler);
      } else options.onMention({});
      _state.lastActiveOffsetkey = decoration.activeOffsetKey;
      return state;
    },

    withEffect(handlers = {}) {
      for (let key in handlers) {
        initMethods[key] = handlers[key];
      }
    },
  };
};
