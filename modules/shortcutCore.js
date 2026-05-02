/**
 * @module shortcutCore
 * Shared utilities for shortcut modules.
 */

const _FULLSCREEN_PANEL =
  'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]';

function isFullscreen() {
  return !!document.querySelector(_FULLSCREEN_PANEL)?.hasAttribute("is-fullscreen");
}

function createShortcutBadge(text) {
  const span = document.createElement("span");
  span.textContent = text;
  span.className = "yt-extras-shortcut-badge";
  return span;
}

/**
 * Registers a keydown listener that fires outside text inputs.
 * action() must return true if it handled the event — only then is the event suppressed.
 * @param {function(KeyboardEvent): boolean} keyTest
 * @param {function(): boolean} action
 */
function registerShortcut(keyTest, action) {
  document.addEventListener(
    "keydown",
    (e) => {
      if (!keyTest(e)) return;
      const tag = document.activeElement?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable
      )
        return;
      if (!action()) return;
      e.preventDefault();
      e.stopPropagation();
    },
    true,
  );
}

/**
 * Watches yt-popover and appends a shortcut badge when the hovered button
 * matches one of the provided finders. Language-independent.
 * @param {{ find: () => HTMLElement|null, badge: string }[]} buttons
 */
function initTooltipWatcher(buttons) {
  let pendingBadge = null;

  document.addEventListener(
    "mouseover",
    (e) => {
      for (const { find, badge } of buttons) {
        const btn = find();
        if (btn && (btn === e.target || btn.contains(e.target))) {
          pendingBadge = badge;
          return;
        }
      }
      pendingBadge = null;
    },
    true,
  );

  function patchPopover(popover) {
    let activeBadge = null;

    new MutationObserver(() => {
      const hasText =
        popover.firstChild?.nodeType === Node.TEXT_NODE &&
        popover.firstChild.data.length > 0;

      if (hasText && pendingBadge) {
        if (activeBadge?.dataset.ruleText !== pendingBadge) {
          activeBadge?.remove();
          activeBadge = createShortcutBadge(pendingBadge);
          activeBadge.dataset.ruleText = pendingBadge;
          popover.appendChild(activeBadge);
        }
      } else {
        activeBadge?.remove();
        activeBadge = null;
      }
    }).observe(popover, { childList: true, subtree: true, characterData: true });
  }

  const popover = document.querySelector("yt-popover");
  if (popover) {
    patchPopover(popover);
    return;
  }

  new MutationObserver((_, obs) => {
    const popover = document.querySelector("yt-popover");
    if (popover) {
      obs.disconnect();
      patchPopover(popover);
    }
  }).observe(document.body, { childList: true, subtree: true });
}
