if (localStorage.getItem("ytExtrasDebug")) {
  const player = document.querySelector("#movie_player");
  if (player) {
    new MutationObserver(() => {
      if (player.classList.contains("ytp-autohide")) {
        player.classList.remove("ytp-autohide");
      }
    }).observe(player, { attributeFilter: ["class"] });
  }
}
