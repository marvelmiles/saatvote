import { Editor, Point, Transforms, Range, Text } from "slate";
import { controlCursor, getRange, hasHotKey } from "./helpers";
import { Node } from "slate";
import { ReactEditor } from "slate-react";
import keycode from "keycode";
import _keyCode from "keyboard-key";
let isDOCHighlighted = false;

export const resetNodes = (editor, options = {}) => {
  const children = [...editor.children];
  children.forEach((node) =>
    editor.apply({ type: "remove_node", path: [0], node })
  );
  if (options.nodes) {
    const nodes = Node.isNode(options.nodes) ? [options.nodes] : options.nodes;

    nodes.forEach((node, i) =>
      editor.apply({ type: "insert_node", path: [i], node: node })
    );
  }
  const point =
    options.at && Point.isPoint(options.at)
      ? options.at
      : Editor.end(editor, []);

  if (point) {
    Transforms.select(editor, point);
  }
};

export const handleKeyCommand = (editor, e) => {
  const { selection } = editor;
  // Slate fails to focus custom void element (e.g emoji type) after deleting backward.
  //  Perform operation manually and focus editor to improve user experience
  if (e.key === "Backspace") {
    e.preventDefault();
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      Editor.deleteBackward(editor, { unit: "character" });
      controlCursor(editor);
    } else {
      Editor.deleteFragment(editor, { direction: "backward" });
      controlCursor(editor);
    }
  }
  // when user highlights multiple paragraph block and replace with a character.
  // slate throws error  can't update an unmounted component. Thus, causing memeory leak.
  // Preventing default and manually replacing selection resolve the issue
  if (selection && !Range.isCollapsed(selection)) {
    const keyModifier =
      /AudioVolumeMute|AudioVolumeUp|AudioVolumeDown|f-[0-9]+|Escape|Home|End|Insert|Delete|Backspace|Tab|CapsLock|Enter|Shift|Unidentified|Control|Meta|Alt|PageUp|PageDown|ArrowRight|ArrowUp|ArrowLeft|ArrowDown/;
    if (hasHotKey(e) || keyModifier.test(e.key)) return;

    e.preventDefault();
    Transforms.delete(editor, {
      at: selection,
    });
    Transforms.insertText(editor, e.key);
  }
  return false;
};
