/**
 * @module playerShortcuts
 * Shortcuts for quick-action bar (fullscreen) and watch-page actions (normal mode):
 * Shift+C — Comments, Shift+L — Like, Shift+D — Dislike, Shift+I — Description
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

function mastheadOffset() {
  const masthead = document.querySelector("ytd-masthead");

  return (masthead?.getBoundingClientRect().height ?? 0) + 5;
}

function scrollToSection(el) {
  const top = el.getBoundingClientRect().top + window.scrollY - mastheadOffset();

  window.scrollTo({ top, behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
        scrollToTop();
      } else {
        scrollToSection(comments);
      }

      return true;
    },
  );

  registerShortcut(
    (e) => shiftOnly(e) && e.code === "KeyI",
    () => {
      if (isFullscreen()) {
        const panel = document.querySelector(
          'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]',
        );
        const isOpen =
          panel?.getAttribute("visibility") ===
          "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED";

        if (isOpen) {
          panel.querySelector("#visibility-button button")?.click();

          return true;
        }

        const btn = document.querySelector(
          "yt-player-overlay-video-details-renderer",
        );

        if (!btn) return false;

        btn.click();

        return true;
      }

      const description = document.querySelector(
        "ytd-watch-metadata #description",
      );

      if (!description) return false;

      const atDescription =
        description.getBoundingClientRect().top < window.innerHeight / 2;

      if (atDescription) {
        scrollToTop();
      } else {
        document.querySelector("#description-inline-expander #expand")?.click();
        scrollToSection(description);
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
