import { Game } from "./Game";

function bootstrap(): void {
  const game = new Game(document.body);

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