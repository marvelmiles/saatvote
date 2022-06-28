import { EditorState, Modifier } from "draft-js";
import { isObject } from "../../helpers";
import { getEntities, getEntity } from "./utils";

export const removeEntity = (editorState, entityConfig) => {
  // expect an entity obj not instance
  let {
    entity,
    collapse = true,
    pushAction = "backspace-character",
  } = entityConfig;
  if (!entity || entity.entityKey) {
    entity = getEntity(editorState); // entityObj
    if (!entity) return;
  }
  let contentState = editorState.getCurrentContent();
  let sel = editorState.getSelection();
  const block = contentState.getBlockForKey(sel.getFocusKey());
  sel = sel.merge({
    anchorOffset: entity.start,
    focusOffset: entity.end,
    // focusKey: block.getKey(),
    // anchorKey: block.getKey(),
  });
  contentState = Modifier.applyEntity(contentState, sel, null);
  editorState = EditorState.push(editorState, contentState, "delete-character");
  console.log(
    `removing ${entity.entityKey}`,
    getEntities(editorState),
    entity.start,
    entity.end
  );
  return forceSelection(
    editorState,
    {
      end: sel.getFocusOffset(),
    },
    collapse
  );
};

export const applyEntity = (editorState, textRange, entityConfig = {}, cb) => {
  const {
    type,
    data = {},
    mutability = "MUTABLE",
    collapse = true,
    // apply-entity causes inaccuracy with redo and undo
    pushAction = "apply-entity",
  } = entityConfig;
  let { end, start, block } = textRange;
  let selection = editorState.getSelection();
  let contentState = editorState.getCurrentContent();
  contentState = contentState.createEntity(type, mutability, data);
  const entityKey = contentState.getLastCreatedEntityKey();
  block = block || contentState.getBlockForKey(selection.getFocusKey());
  selection = selection.merge({
    focusOffset: end,
    anchorOffset: start,
    focusKey: block.getKey(),
    anchorKey: block.getKey(),
  });
  contentState = Modifier.applyEntity(contentState, selection, entityKey);
  editorState = EditorState.push(editorState, contentState, "apply-entity");
  console.log(
    "applied ",
    type,
    selection.getFocusOffset(),
    selection.getAnchorOffset()
  );
  // editorState = EditorState.forceSelection(
  //   editorState,
  //   contentState.getSelectionAfter()
  // );
  cb && cb(entityKey);
  return forceSelection(
    editorState,
    {
      end: selection.getFocusOffset(),
    },
    collapse
  );
};

export const forceSelection = (editorState, merge, collapse = true) => {
  if (!isObject(merge)) merge = {};
  const sel = editorState.getSelection();
  // console.log(
  //   "sel foc= ",
  //   sel.getFocusOffset(),
  //   "sel anc= ",
  //   sel.getAnchorOffset(),
  //   "start= ",
  //   merge.start,
  //   "end= ",
  //   merge.end,
  //   collapse,
  //   "forced info"
  // );

  return EditorState.forceSelection(
    editorState,
    sel.merge({
      anchorOffset: collapse
        ? merge.end !== undefined
          ? merge.end
          : sel.getFocusOffset()
        : merge.start !== undefined
        ? merge.start
        : sel.getAnchorOffset(),
      focusOffset: merge.end !== undefined ? merge.end : sel.getFocusOffset(),
    })
  );
};
