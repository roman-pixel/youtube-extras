/**
 * @module debugAutoHide
 * Keeps the player controls visible by stripping YouTube's `ytp-autohide`
 * class whenever it is added. Active only when localStorage.ytExtrasDebug
 * is set; intended for inspecting tooltips/badges in the player chrome.
 */

if (localStorage.getItem("ytExtrasDebug")) {
  const player = document.querySelector(Selectors.player.root);

  if (player) {
    new MutationObserver(() => {
      if (player.classList.contains(Selectors.player.autohideClass)) {
        player.classList.remove(Selectors.player.autohideClass);
      }
    }).observe(player, { attributeFilter: ["class"] });
  }
}
