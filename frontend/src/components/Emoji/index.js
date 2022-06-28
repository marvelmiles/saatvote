import { findEntityAndDecorate } from "../Editor/utils";
import Emoji from "./components/Emoji";
import Picker from "./components/Picker";

export const createEmojiPlugin = () => {
  const initMethods = {};
  const DecoratedPicker = (props) => <Picker {...props} {...initMethods} />;
  const DecoratedEmoji = (props) => <Emoji {...props} />;
  return {
    decorators: [findEntityAndDecorate("EMOJI", DecoratedEmoji)],
    Picker: DecoratedPicker,
    init(__handlers) {
      for (let key in __handlers) {
        initMethods[key] = __handlers[key];
      }
    },
  };
};
