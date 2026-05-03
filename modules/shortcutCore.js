/**
 * @module shortcutCore
 * Shared utilities for shortcut modules.
 */

function isFullscreen() {
  return !!document
    .querySelector(Selectors.comments.panelFullscreen)
    ?.hasAttribute(Selectors.player.fullscreenAttr);
}

function mastheadOffset() {
  const masthead = document.querySelector(Selectors.chrome.masthead);

  return (masthead?.getBoundingClientRect().height ?? 0) + 5;
}

function scrollToSection(el) {
  const top =
    el.getBoundingClientRect().top + window.scrollY - mastheadOffset();

  window.scrollTo({ top, behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createShortcutBadge(text) {
  const span = document.createElement("span");

  span.textContent = text;
  span.className = "yt-extras-shortcut-badge";

  return span;
}

/**
 * Attaches a custom tooltip to a specific element. Useful for elements that
 * have no native YouTube tooltip. Appended into the closest player container
 * so it remains visible in fullscreen (where body-level children are hidden
 * by the browser top-layer fullscreen rules).
 * @param {HTMLElement} element
 * @param {{ badge: string, text?: string }} opts
 */
function attachCustomTooltip(element, { badge, text }) {
  const tooltip = document.createElement("div");

  tooltip.className = "yt-extras-tooltip";

  if (text) tooltip.appendChild(document.createTextNode(text));

  tooltip.appendChild(createShortcutBadge(badge));

  const parent = element.closest(".html5-video-player") || document.body;

  parent.appendChild(tooltip);

  element.addEventListener("mouseenter", () => {
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    tooltip.style.top = `${rect.bottom - parentRect.top + 8}px`;
    tooltip.style.left = `${rect.left - parentRect.left}px`;
    tooltip.classList.add("yt-extras-tooltip-visible");
  });

  element.addEventListener("mouseleave", () => {
    tooltip.classList.remove("yt-extras-tooltip-visible");
  });
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
    }).observe(popover, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  const popover = document.querySelector(Selectors.chrome.popover);

  if (popover) {
    patchPopover(popover);

    return;
  }

  new MutationObserver((_, obs) => {
    const popover = document.querySelector(Selectors.chrome.popover);

    if (popover) {
      obs.disconnect();
      patchPopover(popover);
    }
  }).observe(document.body, { childList: true, subtree: true });
}
