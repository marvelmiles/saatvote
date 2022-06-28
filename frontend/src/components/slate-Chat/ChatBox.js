import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  Editor,
  Transforms,
  Range,
  createEditor,
  Descendant,
  Node,
  Path,
  Text,
} from "slate";
import { withHistory, useHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
  useSlateStatic,
} from "slate-react";
import ReactDOM from "react-dom";
import {
  withEditorEffect,
  linkifyTextNode,
  withEmoji,
  getRange,
  controlCursor,
} from "./helpers";
import { handleKeyCommand } from "./commands";
import EmojiRenderer from "../EmojiMart/EmojiRender";
import { Picker } from "emoji-mart";
import { Transform } from "@mui/icons-material";

function ChatBox(props) {
  const initValue = [
    {
      type: "paragraph",
      children: [
        { text: "" },
        // {
        //   type: "emoji",
        //   isVoid: true,
        //   children: [{ text: "" }],
        // },
        // { text: "thisisamericacanyoucomingtomerightotheleaveishanna" },
        // {
        //   type: "emoji",
        //   isVoid: true,
        //   children: [{ text: "" }],
        // },
        // { text: "" },
      ],
    },
  ];

  const [value, setValue] = useState(initValue);
  const editorRef = useRef();
  if (!editorRef.current) editorRef.current = withEditorEffect();
  const editor = editorRef.current;

  // const [editor] = useState(withEditorEffect());
  const renderElement = useCallback((props) => <Element {...props} />, []);
  useEffect(() => {
    console.log(editor.selection, "editor init selection");
    controlCursor(editor);
  }, [editor]);
  return (
    <>
      <div>{JSON.stringify(value)}</div>
      <button
        onClick={() => {
          Transforms.insertText(editor, "");
          Transforms.insertNodes(editor, [
            {
              type: "emoji",
              children: [{ text: "" }],
            },
          ]);
          Transforms.insertText(editor, "");
        }}
      >
        click me
      </button>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          linkifyTextNode(editor);
          controlCursor(editor);
          setValue(value);
        }}
      >
        <Editable
          onKeyDown={handleKeyCommand.bind(this, editor)}
          renderElement={renderElement}
          placeholder="type..."
        />
      </Slate>
    </>
  );
}

ChatBox.propTypes = {};

const Link = ({ attributes, children, element }) => {
  return (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  );
};

const Element = (props) => {
  const editor = useSlateStatic();
  const { attributes, children, element } = props;
  switch (element.type) {
    case "emoji":
      return (
        <EmojiRenderer
          //        onClick={() => Transforms.move(editor, { unit: "character" })}
          {...props}
          emojiProps={{
            emoji: { id: "shrug" },
            size: 24,
          }}
          addon="slate"
        />
      );
    case "link":
      return <Link {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default ChatBox;
