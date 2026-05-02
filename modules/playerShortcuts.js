/**
 * @module playerShortcuts
 * Shortcuts for quick-action bar (fullscreen) and watch-page actions (normal mode):
 * Shift+C — Comments, Shift+L — Like, Shift+D — Dislike
 */

const COMMENTS_SVG_START = "M1 6a4 4 0 014-4h14a4 4 0 014 4v10";

const PLAYER_BUTTONS = [
  { selector: "like-button-view-model button", key: "KeyL", badge: "Shift+L" },
  {
    selector: "dislike-button-view-model button",
    key: "KeyD",
    badge: "Shift+D",
  },
];

function findInQuickActions(selector) {
  return (
    document
      .querySelector(".ytp-fullscreen-quick-actions")
      ?.querySelector(selector) ?? null
  );
}

function findInPage(selector) {
  return document.querySelector("#actions")?.querySelector(selector) ?? null;
}

function findButton(selector) {
  return isFullscreen() ? findInQuickActions(selector) : findInPage(selector);
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

function clickFirst(...finders) {
  for (const find of finders) {
    const btn = find();
    if (btn) {
      btn.click();
      return true;
    }
  }
  return false;
}

function shiftOnly(e) {
  return e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}

function initPlayerShortcuts() {
  registerShortcut(
    (e) => shiftOnly(e) && e.code === "KeyC",
    () => {
      if (isFullscreen()) {
        const btn = findCommentsButton();
        if (!btn) return false;
        btn.click();
        return true;
      }
      const comments = document.querySelector("#comments");
      if (!comments) return false;
      const atComments =
        comments.getBoundingClientRect().top < window.innerHeight / 2;
      if (atComments) {
        document
          .querySelector("#primary")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        comments.scrollIntoView({ behavior: "smooth" });
      }
      return true;
    },
  );

  for (const { selector, key } of PLAYER_BUTTONS) {
    registerShortcut(
      (e) => shiftOnly(e) && e.code === key,
      () => clickFirst(() => findButton(selector)),
    );
  }

  initTooltipWatcher([
    { find: findCommentsButton, badge: "Shift+C" },
    ...PLAYER_BUTTONS.map(({ selector, badge }) => ({
      find: () => findButton(selector),
      badge,
    })),
  ]);
}
