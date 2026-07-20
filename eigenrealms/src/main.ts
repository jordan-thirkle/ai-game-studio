import { Game } from "./Game";

function bootstrap(): void {
  const container = document.getElementById("game-container") || document.body;
  const game = new Game(container);

  window.addEventListener("beforeunload", () => {
    game.dispose();
  });

  game.start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}