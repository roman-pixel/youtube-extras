[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](playerShortcuts.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/playerShortcuts.md)

# Player Shortcuts

## What it does

Adds keyboard shortcuts for YouTube player actions. Works in both fullscreen and normal mode. Each shortcut is shown as a badge in the button's native tooltip.

## Shortcuts

| Keys | Action | Fullscreen | Normal |
|------|--------|:----------:|:------:|
| `Shift+C` | Toggle comments panel / scroll to comments | ✓ | ✓ |
| `Shift+L` | Like / unlike | ✓ | ✓ |
| `Shift+D` | Dislike / remove dislike | ✓ | ✓ |
| `Shift+I` | Toggle description panel / scroll to description | ✓ | ✓ |

All shortcuts work on any keyboard layout — `e.code` (physical key position) is used instead of `e.key` (character).

## How it works

**Fullscreen detection**
YouTube sets an `is-fullscreen` attribute on the comments panel element when entering fullscreen. This is more reliable than `document.fullscreenElement`, which returns `null` when YouTube uses its own fullscreen implementation.

**Finding buttons**
Each shortcut searches two contexts in order: the fullscreen quick-action bar (`.ytp-fullscreen-quick-actions`) and the normal watch-page actions bar (`#actions`). Like and dislike are found by their custom element wrappers (`like-button-view-model`, `dislike-button-view-model`), which are language-independent. Comments in fullscreen is found by `aria-label` with a fallback to the unique SVG path of its icon.

**Triggering actions**
Each shortcut clicks the native YouTube button rather than manipulating DOM state directly. This keeps YouTube's internal state consistent (loaded content, animations, counters). The event is suppressed only when a target is actually found — otherwise the key is passed through to YouTube as normal.

**Comments in normal mode**
When not in fullscreen, `Shift+C` toggles between the comments section and the player. If `#comments` is already in the upper half of the viewport (i.e. the user has scrolled to comments), the shortcut scrolls back to the very top of the window. Otherwise it scrolls down to `#comments`.

**Description (`Shift+I`)**
In fullscreen, opens the structured description engagement panel via `yt-player-overlay-video-details-renderer`. If the panel is already expanded (`visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"`), it is closed via its visibility button. In normal mode the shortcut expands the inline description (`#description-inline-expander #expand`) and scrolls to it; if the description is already in the upper half of the viewport, it scrolls back to the top of the window.

**Scroll offset**
Scrolling to a section uses `window.scrollTo` with an offset equal to the live `ytd-masthead` height + 5px, so the target sits just below the sticky header. The masthead height is read on each invocation rather than cached, so any future YouTube redesign of the header is handled automatically. Scrolling back to the player is a plain `window.scrollTo({ top: 0 })` since the player always sits at the top of the page.

**Tooltip badges**
YouTube uses a single shared `yt-popover` for all button tooltips. A `MutationObserver` watches it. Hover tracking via `mouseover` identifies which button is active — so badge injection is language-independent and works regardless of button state (e.g. "Like" vs "Remove like"). Badges appear in both fullscreen and normal mode.

## Files

- `modules/playerShortcuts.js` — button finders and shortcut registration
- `modules/shortcutCore.js` — shared utilities used by this module
