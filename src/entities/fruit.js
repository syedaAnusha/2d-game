import k from "../kaplayCtx";

export function makeOrange(pos) {
  return k.add([
    k.sprite("orange"),
    k.area(),
    k.scale(3),
    k.anchor("center"),
    k.pos(pos),
    k.move(0, 200), // Falling speed
    k.offscreen(),
    "orange", // Tag it as orange
    "fruit", // Generic fruit tag
  ]);
}

export function makeMango(pos) {
  return k.add([
    k.sprite("mango"),
    k.area(),
    k.scale(3),
    k.anchor("center"),
    k.pos(pos),
    k.move(0, 200), // Falling speed
    k.offscreen(),
    "mango", // Tag it as mango
    "fruit", // Generic fruit tag
  ]);
}
