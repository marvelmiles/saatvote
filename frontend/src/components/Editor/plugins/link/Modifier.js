import { applyEntity, removeEntity } from "../../Modifiers";

export const removeLinkEntity = (editorState, entity) => {
  return removeEntity(editorState, {
    entity,
    collapse: true,
  });
};
export const applyLinkEntity = (editorState, textRange, data = {}) => {
  return applyEntity(editorState, textRange, {
    data,
    type: "LINK",
  });
};
