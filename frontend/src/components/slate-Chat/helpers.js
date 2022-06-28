import { useCallback } from "react";
import { createEditor, Transforms, Editor, Range, Node, Element } from "slate";
import { withHistory } from "slate-history";
import { withReact, ReactEditor } from "slate-react";
import { isUrl } from "../../helpers";
export const withEmoji = (editor) => {
  const { isInline, isVoid, normalizeNode } = editor;
  editor.isVoid = (element) => {
    return element.type === "emoji" ? true : isVoid(element);
  };
  editor.isInline = (element) => {
    return element.type === "emoji" ? true : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === "emoji") {
      Transforms.setNodes(editor, { isVoid: true }, { at: path });
      return;
    }
    normalizeNode(entry);
  };

  return editor;
};
const withLink = (editor) => {
  const { isInline, normalizeNode } = editor;
  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };
  // editor.normalizeNode = (entry) => {
  //   const [node, path] = entry;
  //   if (Element.isElement(node) && node.type === "link") {
  //     console.log(node, "uuuuuu");
  //     // if (!node.url) Transforms.setNodes(editor, { url: "" }, { at: path });
  //     return;
  //   }
  //   normalizeNode(entry);
  // };
  return editor;
};
export const withEditorEffect = (editor) => {
  editor = editor || createEditor();
  editor = withHistory(editor);
  editor = withEmoji(editor);
  editor = withLink(editor);
  editor = withReact(editor);

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

export const getRange = (editor, direction, location) => {
  if (!editor.selection) {
    console.log("editor have not selection...");
    return {
      anchor: {
        offset: 0,
        path: [0, 0],
      },
      focus: {
        offset: 0,
        path: [0, 0],
      },
    };
  }
  const [start] = Range.edges(editor.selection);
  const { anchor, focus } = editor.selection;
  let before;
  if (typeof direction === "string") {
    switch (direction) {
      case "after":
        const after = Editor.after(editor, start);
        const t = Editor.range(editor, start, after);
        console.log(after, t, "aftering..");
        return t;
      case "a":
        let _after, _t;
        if (location) {
          _after = Editor.after(editor, editor.selection.focus);
          _t = Editor.range(editor, _after, location.focus);
        } else {
          _after = Editor.after(editor, start);
          _t = Editor.range(editor, start, after);
        }
        console.log(_after, _t, "aftering-tyy..");
        return _t;
      case "before":
        // need fix. for now no location  use it.
        before = Editor.before(editor, start);
        if (before) {
          let c = Editor.before(editor, before);
          if (c) {
            c.offset = 0;
            const d = Editor.range(editor, start, c);
            console.log(
              c,
              getElementAtSelection(editor, d.focus, d.anchor)?.[0],
              "before.."
            );
            return c ? d : { anchor, focus };
          } else return { anchor, focus };
        } else return { anchor, focus };
      default:
        return {
          focus,
          anchor,
        };
    }
  }
};

const focusEditor = (editor, location) => {
  ReactEditor.focus(editor);
  Transforms.select(editor, location);
};

const getElementAtSelection = (editor, from, to) => {
  const { selection } = editor;
  if (!selection && !from && !to) return;
  from = from || selection.anchor.path;
  to = to || selection.focus.path;
  let elements = Node.elements(editor, {
    from,
    to,
  });
  elements.next();
  return elements.next().value;
};

export const controlCursor = (editor, location = "after") => {
  const { selection } = editor;
  if (!selection) return focusEditor(editor, Editor.end(editor, []));
  if (typeof location === "string") {
    if (selection && Range.isCollapsed(selection)) {
      const { text } = Node.get(editor, selection.focus.path);
      // text node or leaf are undefined
      const element = getElementAtSelection(editor)?.[0];
      if (
        (text &&
          !Editor.isStart(editor, Editor.start(editor, []), selection.focus)) ||
        !element
      )
        location = selection.focus;
      else location = getRange(editor, location).focus;
    } else return;
  }
  return focusEditor(editor, location);
};

export const getTextBeforeSelection = (editor, unit = "word") => {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const { anchor } = selection;
    const block = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    });
    const path = block ? block[1] : [];
    const start = Editor.start(editor, path);
    let text = Editor.string(editor, { anchor, focus: start });
    switch (unit) {
      case "word":
        text = text.split(" ");
        return text[text.length - 1];
      default:
        return text;
    }
  }
};

/**
 * From a given KeyboardEvent, check if a user pressed any hot key.
 * Hotkeys[ctrlKey,shiftKey,metaKey,altKey]
 * @param {KeyboardEvent} event Keyboard event.
 * @return {Boolean}  true || false.
 */
export const hasHotKey = (e) => {
  return !!["ctrl", "shift", "alt", "meta"].filter(
    (key) => /**@type {Boolean} */ e[`${key}Key`]
  ).length;
};

const getTextRange = (editor) => {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const { anchor } = selection;
    const edges = Range.edges(selection);
    const block = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    });
    const path = block ? block[1] : [];
    const start = Editor.start(editor, path);
    const end = Editor.end(editor, path);
    let range = { anchor: start, focus: anchor };
    let text = Editor.string(editor, range);
    const li = text.lastIndexOf(" ");
    range = {
      anchor: {
        offset: li > 0 ? li : 0,
        path: range.anchor.path,
      },
      focus: end,
    };
    text = text.split(" ");
    text = text[text.length - 1];
    if (!text) {
      console.log(editor.selection, "empty texting...");
      range = editor.selection;
    }
    return {
      textRange: range,
      text,
    };
  } else {
    const range = getRange(editor);
    console.log(range, "after ranger...");
    return {
      text: "",
      textRange: range,
    };
  }
};

export const linkifyTextNode = (editor) => {
  // previous aim to use range based on before() api
  //  slate wasn't consitence with unit  or selection range
  // resolving to getTextBeforeSelection api  to keep
  // track of text within a block path
  //  const before = getRange(editor, "before");
  //  const text = Editor.string(editor, before);
  const { text, textRange } = getTextRange(editor);
  const detectURL =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  const isLink = detectURL.test(text);
  let element;
  if (textRange && textRange.anchor && textRange.focus) {
    element = getElementAtSelection(editor, textRange.anchor, textRange.focus);
  }
  if (isLink && !element) {
    const c = {
      anchor: textRange.anchor,
      focus: textRange.focus,
    };
    Transforms.setSelection(editor, c);
    // Transforms.move(editor, { unit: "character" });
    // Transforms.insertText(editor, "");
    Transforms.insertNodes(
      editor,
      {
        type: "link",
        url: text,
        children: [{ text: text }],
      },
      { at: c }
    );
    // Transforms.insertText(editor, "");
    const after = getRange(editor, "a", c);
    focusEditor(editor, {
      anchor: after.focus,
      focus: after.focus,
    });
    console.log(after, editor.selection, "after linkifying...");
  } else if (!text) {
    console.log(text, textRange, isLink, element, "emptying ba");
    focusEditor(editor, textRange);
  }
};
