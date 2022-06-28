import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  AtomicBlockUtils,
  CompositeDecorator,
  DefaultDraftBlockRenderMap,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
} from "draft-js";
import Immutable from "immutable";
import { Emoji } from "emoji-mart";
function ChatBox(props) {
  const decorator = new CompositeDecorator([
    {
      strategy: (contentBlock, callback, contentState) => {
        console.log("no image....");
        contentBlock.findEntityRanges((character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "image"
          );
        }, callback);
      },
      component: Emojis,
    },
  ]);
  const Cs = (props) => {
    return <span className="custom-inline">{props.children}</span>;
  };
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );
  const [state, setState] = useState({
    showURLInput: false,
    url: "",
    urlType: "",
  });
  const urlRef = useRef();
  const editorRef = useRef();
  const blockRenderMap = Immutable.Map({
    atomic: {
      element: "span",
      // aliasedElements: ["p", "div", "figure"],
    },
    unstyled: {
      element: "span",
      aliasedElements: ["div"],
      wrapper: <Cs />,
    },
  });
  const extendedBlockRenderMap =
    DefaultDraftBlockRenderMap.merge(blockRenderMap);
  const onURLChange = (e) => setState({ ...state, urlValue: e.target.value });
  const promptForMedia = (type) => {
    setState({
      showURLInput: true,
      urlValue: "",
      urlType: type,
    });
    setTimeout(() => urlRef.current.focus(), 100);
  };
  const addAudio = () => promptForMedia("audio");
  const addImage = () => promptForMedia("image");
  const addVideo = () => promptForMedia("video");
  const onChange = (newState) => setEditorState(newState);
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };
  const confirmMedia = (e) => {
    e.preventDefault();
    // media_link
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      state.urlType,
      "IMMUTABLE",
      { src: state.urlValue, isEmoji: true }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      // newState
      AtomicBlockUtils.insertAtomicBlock(newState, entityKey, " ")
    );
    setState({ ...state, showURLInput: false, urlValue: "" });
    setTimeout(() => editorRef.current.focus(), 100);
    console.log("tyuio...");
  };
  const onURLInputKeyDown = (e) => {
    if (e.which === 13) confirmMedia(e);
  };

  const toggleColor = (toggledColor) => {
    const selection = editorState.getSelection();
    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color);
      },
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    console.log(selection.isCollapsed(), currentStyle.has(toggleColor));
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    onChange(nextEditorState);
  };
  return (
    <>
      <div style={{ marginBottom: 10 }}>
        Here are some local examples that can be entered as a URL:
        <ul>
          <li>media.mp3</li>
          <li>media.png</li>
          <li>media.mp4</li>
        </ul>
      </div>
      <div style={styles.buttons}>
        <button onMouseDown={addAudio} style={{ marginRight: 10 }}>
          Add Audio
        </button>
        <button onMouseDown={addImage} style={{ marginRight: 10 }}>
          Add Image
        </button>
        <button onMouseDown={addVideo} style={{ marginRight: 10 }}>
          Add Video
        </button>
      </div>
      {state.showURLInput && (
        <div style={styles.urlInputContainer}>
          <input
            onChange={onURLChange}
            ref={urlRef}
            style={styles.urlInput}
            type="text"
            value={state.urlValue}
            onKeyDown={onURLInputKeyDown}
          />
          <button onMouseDown={confirmMedia}>Conf irm</button>
        </div>
      )}
      <ColorControls editorState={editorState} onToggle={toggleColor} />
      <Editor
        editorState={editorState}
        onChange={(newState) => onChange(newState)}
        blockRenderMap={extendedBlockRenderMap}
        handleKeyCommand={handleKeyCommand}
        ref={editorRef}
        blockRendererFn={mediaBlockRenderer}
        customStyleMap={colorStyleMap}
        blockStyleFn={blockStyleFn.bind(this, editorState)}
      />
    </>
  );
}

const blockStyleFn = (editorState, contentBlock) => {
  const type = contentBlock.getType();
  const data = contentBlock.getData();
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const startOffset = selection.getStartOffset();
  const entitykey = contentBlock.getEntityAt(startOffset);
  if (entitykey) {
    const entity = contentState.getEntity(entitykey);
    console.log(type, entity.getData(), "block-type");
    if (type === "atomic") {
      return "custom-inline";
    }
  }
};

const mediaBlockRenderer = (block) => {
  if (block.getType() === "atomic") {
    return {
      component: Media,
      editable: false,
      wrapper: "span",
    };
  }
  return null;
};

const Emojis = (props) => {
  console.log("emoji component....");
  return (
    <img
      alt=""
      src="http://www.cfb.com"
      style={{ width: 24, height: 24, border: "2px solid red" }}
    />
  );
};

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
  const url =
    "https://www.google.com/search?q=cr7+image&tbm=isch&source=iu&ictx=1&vet=1&fir=MUY1qlgkxZOYWM%252C-DcqYvHQrZWPEM%252C_%253Bx7Y_md7cr6KIUM%252CCBspcpQflHogDM%252C_%253BCOZD492WTxDYgM%252Cm80BWUL8V06OJM%252C_%253Bl0lAjjx2F8v9eM%252CJBnetHqMSZXItM%252C_%253B5icVN2GcbsT9SM%252CstHsVocmkT5JnM%252C_%253BjrkPBWN3rA9PxM%252CIuJS8kgMbKFVvM%252C_%253BEgHZ5NoCIX4xmM%252Cgmsw0lTqwK4n_M%252C_%253BMasYoR7u-LPOVM%252C8399K6rCgUuk3M%252C_%253BztLOroHEJvmmQM%252CJBnetHqMSZXItM%252C_%253BdDoawhaWsMHJrM%252CstHsVocmkT5JnM%252C_%253B69A_85twv_vxqM%252CRktPhE7RKOtu9M%252C_%253BlgS3oq-4aD3nIM%252C2HJ5CktBNbfejM%252C_%253BYrI8QJRosN57RM%252ChZJhT6EYXRkZ3M%252C_%253BWsZ2GgDJ1Jf5gM%252CPg2EANLv_XuUmM%252C_%253BFa_GLH7MVBH4XM%252CovRKOpfkaNoW8M%252C_%253BVVMI87sLGuX9TM%252CBiIfBaG3xMh9WM%252C_%253BO_qWOg1ygf4gTM%252CNB4E_uNTdmqk2M%252C_&usg=AI4_-kQpM1oXqtchLgeQUqoo5TnqYjuPLQ&sa=X&ved=2ahUKEwjZ5IGgqYb2AhUpiP0HHbISBdEQ9QF6BAgGEAE#imgrc=O_qWOg1ygf4gTM";
  return <Emoji emoji={{ id: "shrug" }} set="apple" size={24} />;
};

const Video = (props) => {
  return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();
  let media = <idv>dd</idv>;
  // media_link
  console.log(type);
  if (type === "audio") {
    media = <Audio src={src} />;
  } else if (type === "image") {
    media = <Image src={src} />;
  } else if (type === "video") {
    media = <Video src={src} />;
  }

  return media;
};

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let style;
    if (this.props.active) {
      style = { ...styles.styleButton, ...colorStyleMap[this.props.style] };
    } else {
      style = styles.styleButton;
    }

    return (
      <span style={style} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

var COLORS = [
  { label: "Red", style: "red" },
  { label: "Orange", style: "orange" },
  { label: "Yellow", style: "yellow" },
  { label: "Green", style: "green" },
  { label: "Blue", style: "blue" },
  { label: "Indigo", style: "indigo" },
  { label: "Violet", style: "violet" },
];

const ColorControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div style={styles.controls}>
      {COLORS.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

// This object provides the styling information for our custom color
// styles.
const colorStyleMap = {
  red: {
    color: "rgba(255, 0, 0, 1.0)",
  },
  orange: {
    color: "rgba(255, 127, 0, 1.0)",
  },
  yellow: {
    color: "rgba(180, 180, 0, 1.0)",
  },
  green: {
    color: "rgba(0, 180, 0, 1.0)",
  },
  blue: {
    color: "rgba(0, 0, 255, 1.0)",
  },
  indigo: {
    color: "rgba(75, 0, 130, 1.0)",
  },
  violet: {
    color: "rgba(127, 0, 255, 1.0)",
  },
};

const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: "'Georgia', serif",
    marginRight: 10,
    padding: 3,
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
  media: {
    width: "100%",
    // Fix an issue with Firefox rendering video controls
    // with 'pre-wrap' white-space
    whiteSpace: "initial",
  },
  controls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: 14,
    marginBottom: 10,
    userSelect: "none",
  },
  styleButton: {
    color: "#999",
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0",
  },
};

ChatBox.propTypes = {};

export default ChatBox;
