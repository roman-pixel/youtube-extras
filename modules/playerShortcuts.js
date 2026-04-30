/**
 * @module playerShortcuts
 * Fullscreen shortcuts for the quick-action bar buttons:
 * Shift+C — Comments, Shift+L — Like, Shift+D — Dislike, Shift+S — Share
 */

const COMMENTS_SVG_START = "M1 6a4 4 0 014-4h14a4 4 0 014 4v10";

function findInQuickActions(selector) {
  return (
    document
      .querySelector(".ytp-fullscreen-quick-actions")
      ?.querySelector(selector) ?? null
  );
}

function findCommentsButton() {
  const byLabel = findInQuickActions(
    'button[aria-label="Comments"], button[aria-label="Комментарии"]',
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

function shiftOnly(e) {
  return e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}

function initPlayerShortcuts() {
  registerFullscreenShortcut(
    (e) => shiftOnly(e) && e.code === "KeyC",
    () => findCommentsButton()?.click(),
  );

  registerFullscreenShortcut(
    (e) => shiftOnly(e) && e.code === "KeyL",
    () => findInQuickActions("like-button-view-model button")?.click(),
  );

  registerFullscreenShortcut(
    (e) => shiftOnly(e) && e.code === "KeyD",
    () => findInQuickActions("dislike-button-view-model button")?.click(),
  );

  registerFullscreenShortcut(
    (e) => shiftOnly(e) && e.code === "KeyS",
    () =>
      findInQuickActions(
        'button[aria-label="Поделиться"], button[aria-label="Share"]',
      )?.click(),
  );

  initTooltipWatcher([
    { find: findCommentsButton, badge: "Shift+C" },
    { find: () => findInQuickActions("like-button-view-model button"), badge: "Shift+L" },
    { find: () => findInQuickActions("dislike-button-view-model button"), badge: "Shift+D" },
    {
      find: () =>
        findInQuickActions(
          'button[aria-label="Поделиться"], button[aria-label="Share"]',
        ),
      badge: "Shift+S",
    },
  ]);
}
