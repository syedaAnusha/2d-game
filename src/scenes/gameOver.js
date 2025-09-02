import k from "../kaplayCtx";

export default function gameOver(bgMusic) {
  // Stop background music
  bgMusic.paused = true;

  // Get scores
  let bestScore = k.getData("best-score") || 0;
  const currentScore = k.getData("current-score");

  // Update best score if needed
  if (bestScore < currentScore) {
    k.setData("best-score", currentScore);
    bestScore = currentScore;
  }

  // Display game over text
  k.add([
    k.text("GAME OVER", { font: "gameFont", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 200),
  ]);

  // Display scores
  k.add([
    k.text(`BEST SCORE: ${bestScore}`, { font: "gameFont", size: 64 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 50),
  ]);

  k.add([
    k.text(`CURRENT SCORE: ${currentScore}`, { font: "gameFont", size: 64 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 50),
  ]);

  // Play again button
  k.add([
    k.text("Click/Tap to Play Again", { font: "gameFont", size: 48 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 200),
  ]);

  // Click/tap to restart
  k.onClick(() => k.go("game"));
}
