/**
 * @module shortcuts
 * Single source of truth for shortcut key codes and their tooltip badges.
 * `code` matches KeyboardEvent.code (layout-independent), `badge` is the label
 * shown in the native button tooltip.
 */

const Shortcuts = {
  comments: { code: "KeyC", badge: "Shift+C" },
  like: { code: "KeyL", badge: "Shift+L" },
  dislike: { code: "KeyD", badge: "Shift+D" },
  description: { code: "KeyI", badge: "Shift+I" },
  searchFocus: { code: "KeyF", badge: "Shift+F" },
  settings: { code: "KeyS", badge: "Shift+S" },
};
