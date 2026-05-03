/**
 * @module playerShortcuts
 * Shortcuts for quick-action bar (fullscreen) and watch-page actions (normal mode):
 * Shift+C — Comments, Shift+L — Like, Shift+D — Dislike, Shift+I — Description,
 * Shift+S — Settings (toggles the gear menu and focuses the search input).
 */

const PLAYER_BUTTONS = [
  { selector: Selectors.like.button, shortcut: Shortcuts.like },
  { selector: Selectors.dislike.button, shortcut: Shortcuts.dislike },
];

function findInQuickActions(selector) {
  return (
    document
      .querySelector(Selectors.player.fullscreenQuickActions)
      ?.querySelector(selector) ?? null
  );
}

function findInPage(selector) {
  return (
    document
      .querySelector(Selectors.player.actionsBar)
      ?.querySelector(selector) ?? null
  );
}

function findButton(selector) {
  return isFullscreen() ? findInQuickActions(selector) : findInPage(selector);
}

function findCommentsButton() {
  const byLabel = findInQuickActions(Selectors.comments.buttonLabels);

  if (byLabel) return byLabel;

  for (const path of document.querySelectorAll(
    `${Selectors.player.fullscreenQuickActions} button svg path`,
  )) {
    if (
      path.getAttribute("d")?.startsWith(Selectors.comments.iconSvgPathStart)
    ) {
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
    (e) => shiftOnly(e) && e.code === Shortcuts.comments.code,
    () => {
      if (isFullscreen()) {
        const btn = findCommentsButton();

        if (!btn) return false;

        btn.click();

        return true;
      }

      const comments = document.querySelector(Selectors.comments.section);

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
    (e) => shiftOnly(e) && e.code === Shortcuts.description.code,
    () => {
      if (isFullscreen()) {
        const panel = document.querySelector(
          Selectors.description.panelFullscreen,
        );
        const isOpen =
          panel?.getAttribute("visibility") ===
          Selectors.description.panelVisibleAttr;

        if (isOpen) {
          panel.querySelector(Selectors.description.panelToggleButton)?.click();

          return true;
        }

        const btn = document.querySelector(
          Selectors.description.fullscreenOpenTrigger,
        );

        if (!btn) return false;

        btn.click();

        return true;
      }

      const description = document.querySelector(Selectors.description.inline);

      if (!description) return false;

      const atDescription =
        description.getBoundingClientRect().top < window.innerHeight / 2;

      if (atDescription) {
        scrollToTop();
      } else {
        document.querySelector(Selectors.description.inlineExpand)?.click();
        scrollToSection(description);
      }

      return true;
    },
  );

  for (const { selector, shortcut } of PLAYER_BUTTONS) {
    registerShortcut(
      (e) => shiftOnly(e) && e.code === shortcut.code,
      () => clickFirst(() => findButton(selector)),
    );
  }

  registerShortcut(
    (e) => shiftOnly(e) && e.code === Shortcuts.settings.code,
    () => {
      const btn = document.querySelector(Selectors.playerMenu.settingsButton);

      if (!btn) return false;

      const willOpen = btn.getAttribute("aria-expanded") !== "true";

      btn.click();

      if (willOpen) focusPlayerMenuSearch();

      return true;
    },
  );

  initTooltipWatcher([
    { find: findCommentsButton, badge: Shortcuts.comments.badge },
    ...PLAYER_BUTTONS.map(({ selector, shortcut }) => ({
      find: () => findButton(selector),
      badge: shortcut.badge,
    })),
    {
      find: () => document.querySelector(Selectors.playerMenu.settingsButton),
      badge: Shortcuts.settings.badge,
    },
  ]);
}
