import k from "../kaplayCtx";

export default function mainMenu() {
  // Initialize best score if not set
  if (!k.getData("best-score")) k.setData("best-score", 0);

  // Add background
  k.add([k.sprite("background"), k.scale(1), k.pos(0, 0)]);

  // Game title
  k.add([
    k.text("FRUIT CATCHER", { font: "gameFont", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, 200),
  ]);

  // Start game button
  k.add([
    k.text("Click/Tap to Start", { font: "gameFont", size: 64 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y),
  ]);

  // Instructions
  k.add([
    k.text("Catch fruits with the matching basket color!", {
      font: "gameFont",
      size: 32,
    }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 100),
  ]);

  k.add([
    k.text("Yellow basket catches mangoes, Orange basket catches oranges", {
      font: "gameFont",
      size: 24,
    }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 150),
  ]);

  // Click/tap to start
  k.onClick(() => k.go("game"));
}
