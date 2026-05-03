[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](playerShortcuts.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/playerShortcuts.md)

# Player Shortcuts

Keyboard shortcuts for the YouTube watch page. All work in fullscreen and normal mode. Layout-independent — `KeyboardEvent.code` is used, not `key`.

## Shortcuts

| Keys | Action | Fullscreen | Normal |
|------|--------|:----------:|:------:|
| `Shift+C` | Toggle comments panel / scroll to comments | ✓ | ✓ |
| `Shift+L` | Like / unlike | ✓ | ✓ |
| `Shift+D` | Dislike / remove dislike | ✓ | ✓ |
| `Shift+I` | Toggle description / scroll to description | ✓ | ✓ |
| `Shift+S` | Toggle settings menu, focus its search input | ✓ | ✓ |

## Behavior

- **Fullscreen detection.** Reads the `is-fullscreen` attribute from the comments engagement panel. More reliable than `document.fullscreenElement`, which is `null` when YouTube manages fullscreen itself.
- **Button lookup.** Each shortcut searches `.ytp-fullscreen-quick-actions` first, then `#actions`. Like/Dislike are matched by their custom-element wrappers (language-independent). The fullscreen Comments button is matched by `aria-label` with a fallback to a unique SVG path.
- **Action.** Shortcuts click native YouTube buttons. The keydown event is suppressed only if a target is found.
- **Comments scroll (`Shift+C`, normal mode).** If `#comments` is in the upper half of the viewport, scroll to top; otherwise scroll to `#comments`.
- **Description (`Shift+I`).** Fullscreen: opens the structured description panel, or closes it if already expanded. Normal mode: expands the inline description and scrolls to it; if already in view, scrolls to top.
- **Scroll offset.** `window.scrollTo` with offset = current `ytd-masthead` height + 5px. Read on each call.
- **Settings (`Shift+S`).** Clicks `.ytp-settings-button` to toggle the menu. On open, requests focus on the menu's search input via `focusPlayerMenuSearch()`.
- **Tooltip badges.** A `MutationObserver` patches the shared `yt-popover`. Hover tracking via `mouseover` identifies the active button — language-independent, works for any button state.

## Files

- `modules/playerShortcuts.js` — registration and button finders
- `modules/shortcutCore.js` — `registerShortcut`, `initTooltipWatcher`, scroll helpers
- `modules/shortcuts.js` — shortcut codes and badges
