import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
  convertFromRaw,
  Modifier,
  KeyBindingUtil,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { Emoji } from "emoji-mart";
const { hasCommandModifier } = KeyBindingUtil;
const rawContent = {
  blocks: [
    {
      text:
        'This is an "immutable" entity: Superman. Deleting any ' +
        "characters will delete the entire entity. Adding characters " +
        "will remove the entity from the range.",
      type: "unstyled",
      entityRanges: [{ offset: 31, length: 8, key: "first" }],
    },
    {
      text: "",
      type: "unstyled",
    },
    {
      text:
        'This is a "mutable" entity: Batman. Characters may be added ' +
        "and removed.",
      type: "unstyled",
      entityRanges: [{ offset: 28, length: 6, key: "second" }],
    },
    {
      text: "",
      type: "unstyled",
    },
    {
      text:
        'This is a "segmented" entity: Green Lantern. Deleting any ' +
        'characters will delete the current "segment" from the range. ' +
        "Adding characters will remove the entire entity from the range.",
      type: "unstyled",
      entityRanges: [{ offset: 30, length: 13, key: "third" }],
    },
  ],

  entityMap: {
    first: {
      type: "TOKEN",
      mutability: "IMMUTABLE",
    },
    second: {
      type: "TOKEN",
      mutability: "MUTABLE",
    },
    third: {
      type: "TOKEN",
      mutability: "SEGMENTED",
    },
  },
};
function MyEditor() {
  const decorator = new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: HandleSpan,
    },
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
    {
      strategy: emojiStrategy,
      component: <Emoji emoji={{ id: "shrug" }} size={24} />,
    },
    {
      strategy: getEntityStrategy("IMMUTABLE"),
      component: TokenSpan,
    },
    {
      strategy: getEntityStrategy("MUTABLE"),
      component: TokenSpan,
    },
    {
      strategy: getEntityStrategy("SEGMENTED"),
      component: TokenSpan,
    },
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);
  const blocks = convertFromRaw(rawContent);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createWithContent(blocks, decorator)
  );
  const [state, setState] = useState({
    showURLInput: false,
    urlValue: "",
  });
  const contentState = editorState.getCurrentContent();
  const editorRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
    editorRef.current.focus();
  }, []);

  const onChange = (newState) => setEditorState(newState);

  const keyBindingFn = (e) => {
    if (e.key === "q" && hasCommandModifier(e)) return "save-content";
    return getDefaultKeyBinding(e);
  };

  const handleCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    console.log(command, newState, "jkkk");
    if (command === "save-content") {
      // save content
      console.log("saving content....");
      return true;
    } else {
      if (newState) {
        onChange(newState);
        return true;
      }
      return false;
    }
  };

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };
  let className = "RichEditor-editor";

  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
      console.log("tyii");
    }
  }

  const onURLChange = (e) => setState({ ...state, urlValue: e.target.value });
  const addEmoji = (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { url: state.urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggle(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    setState({ showURLInput: false, urlValue: "" });
    setTimeout(() => {
      editorRef.current.focus();
    }, 0);
    console.log("adding emoji...");
  };
  const confirmLink = (e) => {
    e.preventDefault();
    console.log("clicked...");
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url: state.urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    setState({ showURLInput: false, urlValue: "" });
    setTimeout(() => {
      editorRef.current.focus();
    }, 0);
  };
  const promptLink = (e) => {
    console.log("promtping...");
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = "";
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      console.log("shud...");
      setState({
        showURLInput: true,
        urlValue: url,
      });
      setTimeout(() => {
        editorRef.current.focus();
      }, 0);
    }
  };
  const removeLink = (e) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };
  return (
    <>
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      {state.showURLInput && (
        <div style={styles.urlInputContainer}>
          <input
            onChange={onURLChange}
            ref={inputRef}
            style={styles.urlInput}
            type="text"
            value={state.urlValue}
            onKeyDown={(e) => {
              if (e.which === 13) confirmLink(e);
            }}
          />
          <button onClick={confirmLink}>Confirm</button>
        </div>
      )}
      <button onClick={addEmoji}>Add emoji</button>
      <button onClick={promptLink}>Add link</button>
      <button onClick={removeLink}>Remove Link</button>
      <Editor
        placeholder="MY custom editor..."
        spellCheck={true}
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleCommand}
      />
    </>
  );
}

const HANDLE_REGEX = /@[\w]+/g;
const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g;

const handleStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
};

const hashtagStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
};

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

const HandleSpan = (props) => {
  return (
    <span style={styles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};

const HashtagSpan = (props) => {
  return (
    <span style={styles.hashtag} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const emojiStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "EMOJI"
    );
  }, callback);
};

const getEntityStrategy = (mutability) => {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };
};

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case "IMMUTABLE":
      return styles.immutable;
    case "MUTABLE":
      return styles.mutable;
    case "SEGMENTED":
      return styles.segmented;
    default:
      return null;
  }
}

const TokenSpan = (props) => {
  const style = getDecoratedStyle(
    props.contentState.getEntity(props.entityKey).getMutability()
  );
  return (
    <span data-offset-key={props.offsetkey} style={style}>
      {props.children}
    </span>
  );
};

const StyleButton = (props) => {
  const onToggle = (e) => {
    e.preventDefault();
    props.onToggle(props.style);
  };
  let className = "RichEditor-styleButton";
  if (props.active) {
    className += " RichEditor-activeButton";
  }
  return (
    <span className={className} style={{ margin: "5px" }} onClick={onToggle}>
      {props.label}
    </span>
  );
};

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: "Blockquote", style: "blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Code Block", style: "code-block" },
  ];

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  var INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" },
  ];

  return (
    <>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </>
  );
};

const styles = {
  root: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: 600,
  },
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: "center",
  },
  immutable: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "2px 0",
  },
  mutable: {
    backgroundColor: "rgba(204, 204, 255, 1.0) !important",
    padding: "2px 0",
  },
  segmented: {
    backgroundColor: "rgba(248, 222, 126, 1.0)",
    padding: "2px 0",
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: "'Georgia', serif",
    marginRight: 10,
    padding: 3,
  },

  link: {
    color: "#3b5998",
    textDecoration: "underline",
  },
  handle: {
    color: "red",
    direction: "ltr",
    unicodeBidi: "bidi-override",
  },
  hashtag: {
    color: "rgba(95, 184, 138, 1.0)",
  },
};

export default MyEditor;
