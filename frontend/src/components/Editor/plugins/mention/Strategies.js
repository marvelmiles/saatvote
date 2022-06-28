export const findMentionEntity = (triggers) => {
  return (block, cb, state) => {
    block.findEntityRanges((ch) => {
      const entityKey = ch.getEntity();
      return (
        entityKey &&
        triggers.some(
          (trigger) => state.getEntity(entityKey).getType() === `mention`
        )
      );
    }, cb);
  };
};
