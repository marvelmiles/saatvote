import { applyEntity, removeEntity } from "../../Modifiers";

export const applyHashTagEntity = (editorState, textRange, data = {}, cb) => {
  return applyEntity(
    editorState,
    textRange,
    {
      data,
      type: "HASHTAG",
    },
    cb
  );
};

export const removeHashTagEntity = (editorState, entity) => {
  return removeEntity(editorState, {
    entity,
    collapse: true,
  });
};
