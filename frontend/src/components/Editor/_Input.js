import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { convertToRaw, Editor, EditorState, RichUtils } from "draft-js";
import { composeDecorators, getDecoratorLength } from "./utils";
import { handleKeyBind } from "./commands";
import { createMentionPlugin } from "./plugins/mention";
import { createLinkifyPlugin } from "./plugins/link";
import { createHashTagPlugin } from "./plugins/hashTag";
import { pluginHooks, registerHooks, _hooks } from "./hookHandlers";
import { createEmojiPlugin } from "../Emoji";
import { getMatchText } from "./plugins/link/utils";
import { applyLink } from "./plugins/link/Modifier";
const initialize = (plugins, pluginsMethods = {}) => {
  const pluginKeyMap = {};
  for (let plug in plugins) {
    plug = plugins[plug];
    if (typeof plug.init === "function") plug.init(pluginsMethods);
    if (plug.key) pluginKeyMap[plug.key] = plug;
  }
  return pluginKeyMap;
};

const Input = forwardRef(
  (
    {
      onBlur,
      onFocus,
      onChange,
      editorState,
      pluginsConfig = {},
      readOnly,
      contentState,
      ...args
    },
    ref
  ) => {
    const hasChangeFn = typeof onChange === "function";
    const linkifyPlugin = createLinkifyPlugin(pluginsConfig.linkify);
    const mentionPlugin = createMentionPlugin(pluginsConfig.mention);
    const hashTagPlugin = createHashTagPlugin(pluginsConfig.hashTag);
    const emojiPlugin = createEmojiPlugin(pluginsConfig.emoji);
    const cache = useRef({
      onChange,
    });
    const pluginsRef = useRef({
      mentionPlugin,
      linkifyPlugin,
      hashTagPlugin,
      emojiPlugin,
    });
    const plugins = pluginsRef.current;
    const { Picker } = plugins.emojiPlugin;
    const [_editorState, _setEditorState] = useState(
      contentState
        ? EditorState.createWithContent(contentState)
        : EditorState.createEmpty()
    );
    const getPluginHandlers = () => ({
      registerHooks: registerHooks,
      getEditor: () => editorRef.current?.editor,
      setEditorState: (state, key) => _onChange(state, key),
      getEditorState: () => {
        return editorState;
      },
      setState: (state) => _setEditorState(state),
    });
    const pluginsKeyMap = initialize(plugins, getPluginHandlers());
    editorState = hasChangeFn ? editorState : _editorState;
    let editorRef = useRef();
    const _onChange = useCallback(
      (state, pluginKey) => {
        if (typeof pluginKey === "string") {
          let plug = pluginsKeyMap[pluginKey];
          if (plug && typeof plug.onChange === "function")
            state = plug.onChange(state);
        } else {
          Object.keys(plugins).forEach((plug) => {
            plug = plugins[plug];
            if (typeof plug.onChange === "function")
              state = plug.onChange(state);
          });
        }
        hasChangeFn ? cache.current.onChange?.(state) : _setEditorState(state);
        console.log("save change...", pluginKey);
      },
      [plugins, pluginsKeyMap, hasChangeFn]
    );

    useEffect(() => {
      const currDec = editorState.getDecorator();
      if (!currDec) {
        _onChange(
          EditorState.set(editorState, {
            decorator: composeDecorators(plugins),
          })
        );
      } else if (
        getDecoratorLength(currDec) !==
        getDecoratorLength(cache.current.decorator)
      ) {
        _onChange(
          EditorState.set(editorState, {
            decorator: currDec,
          })
        );
      }
      cache.current.decorator = currDec;
    }, [editorState, plugins, _onChange]);

    return (
      <>
        <Editor
          {...args}
          {...pluginHooks}
          handleReturn={() => {
            console.log("handle enter..");
          }}
          handleBeforeInput={() => {
            console.log("handler before inputy...");
          }}
          className="piwer"
          readOnly={readOnly}
          editorState={editorState}
          onChange={_onChange}
          onBlur={() => {
            typeof onBlur === "function" && onBlur();
          }}
          onFocus={() => {
            typeof onFocus === "function" && onFocus();
          }}
          placeholder=""
          ref={(node) => {
            ref && (ref.current = node);
          }}
        />
        {!readOnly && <Picker {...pluginsConfig.emoji?.picker} />}
      </>
    );
  }
);

Input.propTypes = {};

export default Input;
