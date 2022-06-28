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
import {
  composeDecorators,
  getDecoratorLength,
  getEntities,
  getEntity,
} from "./utils";
import { handleKeyBind } from "./commands";
import { createMentionPlugin } from "./plugins/mention";
import { createLinkifyPlugin } from "./plugins/link";
import { createHashTagPlugin } from "./plugins/hashTag";
import { pluginHooks, registerHooks, _hooks } from "./hookHandlers";
import { createEmojiPlugin } from "../Emoji";
// import {  } from "./plugins/link/utils";
import { applyLink, removeLinkEntity } from "./plugins/link/Modifier";
import { getMatchText } from "./plugins/hashTag/utils";
import { removeHashTagEntity } from "./plugins/hashTag/Modifier";
const _applyWithEffect = (plugins, pluginsMethods = {}) => {
  const pluginKeyMap = {};
  for (let plug in plugins) {
    plug = plugins[plug];
    if (typeof plug.withEffect === "function") plug.withEffect(pluginsMethods);
    if (plug.key) pluginKeyMap[plug.key] = plug;
  }
  return pluginKeyMap;
};

/**
 * @Note Aiming to store data as entities due to serialization on submit.
 * moved away from draft-js/plugins cause it has no support for entity.
 * presently INPUT support only emoji and mention plugin.
 * Having issue with undo/redo with other plugins.
 */

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
    const mentionPlugin = createMentionPlugin(pluginsConfig.mention);
    const emojiPlugin = createEmojiPlugin(pluginsConfig.emoji);
    // const linkifyPlugin = createLinkifyPlugin(pluginsConfig.linkify);
    // const hashTagPlugin = createHashTagPlugin(pluginsConfig.hashTag);
    const cache = useRef({
      onChange,
    });
    const pluginsRef = useRef({
      mentionPlugin,
      emojiPlugin,
      // linkifyPlugin,
      // hashTagPlugin,
    });

    const plugins = pluginsRef.current;
    // const { Picker } = plugins.emojiPlugin;
    const [_editorState, _setEditorState] = useState(
      contentState
        ? EditorState.createWithContent(contentState)
        : EditorState.createEmpty()
    );
    const pluginsKeyMapRef = useRef({});
    editorState = hasChangeFn ? editorState : _editorState;
    const _getPluginHandlers = (_state) => ({
      registerHooks: registerHooks,
      getEditor: () => editorRef.current?.editor,
      setEditorState: (state, key) => _onChange(state, key),
      getEditorState: () => {
        return _state || editorState;
      },
    });
    _applyWithEffect(plugins, {
      registerHooks: registerHooks,
      getEditor: () => editorRef.current?.editor,
      setEditorState: (state, key) => _onChange(state, key),
      getEditorState: () => {
        return editorState;
      },
    });
    const _onChange = useCallback(
      (state, pluginKey) => {
        _applyWithEffect(plugins, {
          registerHooks: registerHooks,
          getEditor: () => editorRef.current?.editor,
          setEditorState: (state, key) => _onChange(state, key),
          getEditorState: () => {
            return state;
          },
        });
        if (typeof pluginKey === "string") {
          let plug = pluginsKeyMapRef.current[pluginKey];
          if (plug && typeof plug.onChange === "function")
            state = plug.onChange(state);
        } else {
          Object.keys(plugins).forEach((plug) => {
            plug = plugins[plug];
            if (typeof plug.onChange === "function")
              state = plug.onChange(state);
          });
        }
        // const t = getMatchText(state);
        // if (!t) {
        //   const c = removeHashTagEntity(state);
        //   if (c) state = c;
        // }
        if (state) {
          hasChangeFn
            ? cache.current.onChange?.(state)
            : _setEditorState(state);

          console.log("save change power...", getEntities(state));
        }
      },
      [plugins, hasChangeFn]
    );

    let editorRef = useRef();
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
        {/* {!readOnly && <Picker {...pluginsConfig.emoji?.picker} />} */}
      </>
    );
  }
);

Input.propTypes = {};

export default Input;
