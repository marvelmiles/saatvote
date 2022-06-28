import { handleKeyBind } from "./commands";

const _hooks = {
  keyBindingFn: [],
};
export const registerHooks = (hooks) => {
  for (let hook in hooks) {
    if (hook === "keyBindindFn" && typeof hooks[hook] === "function") {
      _hooks[hook].push(hooks[hook]);
    }
  }
};

export const pluginHooks = () => {
  return {
    onKeyBindingFn: handleKeyBind(_hooks.keyBindingFn),
  };
};
