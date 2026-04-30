/**
 * @module commentsShortcut
 * Adds Shift+C hotkey to toggle the comments panel in YouTube fullscreen mode.
 * Also patches the button tooltip to display the shortcut hint.
 */

const PANEL_SELECTOR =
  'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]';

const COMMENTS_SVG_START = "M1 6a4 4 0 014-4h14a4 4 0 014 4v10";

const TOOLTIP_TEXTS = new Set([
  "Показать комментарии",
  "Скрыть комментарии",
  "Comments",
  "Hide comments",
]);

function isFullscreen() {
  const panel = document.querySelector(PANEL_SELECTOR);
  return !!panel?.hasAttribute("is-fullscreen");
}

/**
 * Finds the comments toggle button inside the fullscreen quick-actions bar.
 * Primary lookup is by aria-label; falls back to the unique SVG path of the icon.
 * @returns {HTMLButtonElement|null}
 */
function findCommentsButton() {
  const byLabel = document.querySelector(
    '.ytp-fullscreen-quick-actions button[aria-label="Comments"],' +
      '.ytp-fullscreen-quick-actions button[aria-label="Комментарии"]',
  );
  if (byLabel) return byLabel;

  for (const path of document.querySelectorAll(
    ".ytp-fullscreen-quick-actions button svg path",
  )) {
    if (path.getAttribute("d")?.startsWith(COMMENTS_SVG_START)) {
      return path.closest("button");
    }
  }

  return null;
}

function onCommentsShortcut(e) {
  if (!e.shiftKey || e.code !== "KeyC" || e.ctrlKey || e.altKey || e.metaKey)
    return;

  const tag = document.activeElement?.tagName;
  if (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    document.activeElement?.isContentEditable
  )
    return;

  if (!isFullscreen()) return;

  const btn = findCommentsButton();
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();
  btn.click();
}

function createShortcutBadge() {
  const span = document.createElement("span");
  span.textContent = "Shift+C";
  span.style.cssText = `
    display: inline-block;
    margin-left: 6px;
    padding: 1px 5px;
    border-radius: 3px;
    background: rgba(255,255,255,0.05);
    font-weight: bold;
    font-size: 0.85em;
    vertical-align: middle;
    letter-spacing: 0.03em;
  `;
  return span;
}

/**
 * Watches the shared yt-popover element and appends a shortcut badge
 * when it displays the comments button tooltip.
 * Modifies the existing text node in place to preserve YouTube's internal reference.
 * @param {Element} popover
 */
function patchTooltip(popover) {
  let badge = null;

  new MutationObserver(() => {
    const node = popover.firstChild;
    if (node?.nodeType !== Node.TEXT_NODE) return;

    if (TOOLTIP_TEXTS.has(node.data)) {
      if (!badge) {
        badge = createShortcutBadge();
        popover.appendChild(badge);
      }
    } else {
      badge?.remove();
      badge = null;
    }
  }).observe(popover, { childList: true, subtree: true, characterData: true });
}

function initTooltipPatch() {
  const popover = document.querySelector("yt-popover");
  if (popover) {
    patchTooltip(popover);
    return;
  }

  new MutationObserver((_, obs) => {
    const popover = document.querySelector("yt-popover");
    if (popover) {
      obs.disconnect();
      patchTooltip(popover);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

/**
 * Entry point. Call once from content.js.
 */
function initCommentsShortcut() {
  document.addEventListener("keydown", onCommentsShortcut, true);
  initTooltipPatch();
}
