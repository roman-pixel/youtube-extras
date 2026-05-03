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
