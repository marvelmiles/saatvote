import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  cloneElement,
} from "react";
import PropTypes, { element } from "prop-types";
import {
  createEditor,
  Transforms,
  Editor,
  Text,
  Node,
  Location,
  Point,
  Path,
} from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
  ReactEditor,
} from "slate-react";
import EmojiMart from "./EmojiMart";
import { Button } from "@mui/material";
import { Emoji } from "emoji-mart";
import isUrl from "is-url";
import { withHistory } from "slate-history";
// You can define which elements are treated as void by overriding the editor.isVoid function. (By default it always returns false.)

const withEffect = (editor) => {
  const { isVoid, isInline, insertData } = editor;
  editor = withReact(editor);
  editor = withHistory(editor);
  editor.isVoid = (element) => {
    return ["image"].includes(element.type) ? true : isVoid(element);
  };
  editor.isInline = (element) => {
    return element.type === "image" ? true : isInline(element);
  };
  // editor.insertData = (data) => {
  //   const text = data.getData("text/plain");
  //   const { files } = data;

  //   if (files && files.length > 0) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       const [mime] = file.type.split("/");

  //       if (mime === "image") {
  //         reader.addEventListener("load", () => {
  //           const url = reader.result;
  //           insertImage(editor, url);
  //         });

  //         reader.readAsDataURL(file);
  //       }
  //     }
  //   } else if (isImageUrl(text)) {
  //     insertImage(editor, text);
  //   } else {
  //     insertData(data);
  //   }
  // };

  return editor;
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return ["png", "svg", "jpg", "jpeg"].includes(ext);
};

// ___insert
const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = {
    type: "image",
    url,
    children: [text],
    element: <Emoji emoji={{ id: "shrug" }} set="apple" size={24} />,
  };
  Transforms.insertNodes(editor, image);
  Transforms.select(editor, editor.selection);
};
 

const serialize = (value) => {
  return (
    value
      // Return the string content of each paragraph in th  dvae value's children.
      .map((n) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) => {
  // Return a value array of children derived by splitting the string.
  return string.split("\n").map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });

    return !!match;
  },
  toggleBlockQuote(editor) {
    Transforms.wrapNodes(
      editor,
      { type: "quote", children: [] },
      {
        match: (node) => Editor.isBlock(editor, node),
        mode: "lowest",
      }
    );
  },
  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      {
        // This only matches text nodes that are not already italic.
        match: (node, path) => Text.isText(node) && node.italic !== true,
        split: true,
      }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();

  const path = ReactEditor.findPath(editor, element);
  const selected = useSelected();
  const focused = useFocused();
  useEffect(() => {
    // ___images
    console.log("image...", element, attributes);
  }, []);
  return (
    <>
      <div
        {...attributes}
        style={{ width: "24px", height: 24, display: "inline" }}
      >
        <div
          contentEditable={false}
          style={{ width: "24px", height: 24, display: "inline" }}
        >
          {/* <img
            {...attributes}
            src={element.url}
            alt=""
            style={{ width: "24px", height: 24, display: "inline" }}
          /> */}
          <Emoji emoji={{ id: "shrug" }} size={24} />
        </div>
        {children}
      </div>
    </>
  );
};

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <span {...props.attributes}>{props.children}</span>;
};

const EmojiE = ({ element, attributes }) => {
  useEffect(() => {
    console.log("props...");
  }, []);
  return (
    <span {...attributes}>
      <div style={{ width: "24px", height: "24px" }} contentEditable={false}>
        <Emoji emoji={{ id: element.id }} size={24} />
      </div>
    </span>
  );
};

function ChatBox(props) {
  const { current: editor } = useRef(withEffect(createEditor()));
  // Keep track of state for the value of the editor.
  // ___initValue

  const focusEditor = useCallback(() => {
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.end(editor, []));
  }, [editor]);
  // useEffect(() => {
  //   focusEditor();
  // }, [focusEditor]);

  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "dddddddddddddd" }],
    },
    // {
    //   type: "image",
    //   url: "https://source.unsplash.com/kFrdX5IeQzI",
    //   children: [{ text: "" }],
    //   element: <Emoji emoji={{ id: "shrug" }} set="apple" size={24} />,
    // },
    // {
    //   type: "paragraph",
    //   children: [{ text: "" }],
    // },
  ]);
  const [openEmoji, setOpenEmoji] = useState(false);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "image":
        return <Image {...props} />;
      case "emoji":
        return <EmojiE {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(({ children, attributes, leaf }) => {
    return (
      <span
        {...attributes}
        style={{
          fontWeight: leaf.bold ? "bold" : "normal",
          fontStyle: leaf.italic ? "italic" : "normal",
        }}
      >
        {children}
      </span>
    );
  }, []);

  const handleCommands = (event) => {
    if (!event.ctrlKey) {
      return;
    }
    switch (event.key) {
      case "`": {
        event.preventDefault();
        CustomEditor.toggleCodeBlock(editor);
        break;
      }

      case "b": {
        event.preventDefault();
        CustomEditor.toggleBoldMark(editor);
        break;
      }
      default:
        return false;
    }
  };

  return (
    <>
      <button
        onClick={() => {
          const image = [
            {
              type: "image",
              children: [{ text: "" }],
              id: "shrug",
              url: "https://source.unsplash.com/kFrdX5IeQzI",
            },
            {
              type: "paragraph",
              children: [{ text: " " }],
            },
          ];
          Transforms.insertNodes(editor, image);
          focusEditor();
        }}
      >
        click me
      </button>
      <EmojiMart
        open={openEmoji}
        onClick={(emojiData, elem) => {
          const { selection } = editor;
          console.log(emojiData.native, "rty");

          if (!!selection) {
            const [parentNode, parentPath] = Editor.parent(
              editor,
              selection.focus?.path
            );
          }

          // Transforms.insertNodes(editor, {
          //   type: "emoji",
          //   element: elem,
          //   children: [],
          // });
        }}
      />
      <Button onClick={() => setOpenEmoji(!openEmoji)}>toggle emoji</Button>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          // const isChange = editor.operations.some(
          //   (op) => "set_selection" !== op.type
          // );
          // if (isChange) {
          //   const content = JSON.stringify(value);
          //   localStorage.setItem("content", serialize(value));
          // }
          // console.log(value, "io");
          // ___change
          console.log(newValue);
          setValue(newValue);
        }}
      >
        <Editable
          className="editable"
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleCommands}
          autoFocus={true}
        />
      </Slate>
    </>
  );
}

ChatBox.propTypes = {};

export default ChatBox;
