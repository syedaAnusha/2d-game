import k from "../kaplayCtx";

export function makeBasket(pos) {
  const basket = k.add([
    k.sprite("basket", { anim: "yellow" }), // Start with yellow
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.move(0, 0), // No initial movement
    {
      currentColor: "yellow", // Track current color
      changeColor() {
        if (this.currentColor === "yellow") {
          this.play("orange");
          this.currentColor = "orange";
        } else {
          this.play("yellow");
          this.currentColor = "yellow";
        }
      },
    },
  ]);

  return basket;
}
