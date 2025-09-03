import k from "./kaplayCtx";

export function makeSonic(position) {
  return k.add([
    k.sprite("sonic", { anim: "run" }),
    k.pos(position),
    k.anchor("center"),
    k.scale(4),
    k.area(),
    k.z(10), // Add a higher z-index to make Sonic appear above other elements
    k.body({ jumpForce: 1700 }),
    {
      setControls() {
        // Add direct keyboard handler for space key
        k.onKeyPress("space", () => {
          if (this.isGrounded()) {
            this.play("jump");
            this.jump();
            k.play("jump", { volume: 0.5 });
          }
        });

        // Keep original button handler for mouse clicks
        k.onButtonPress("jump", () => {
          if (this.isGrounded()) {
            this.play("jump");
            this.jump();
            k.play("jump", { volume: 0.5 });
          }
        });
      },
      setEvents() {
        this.onGround(() => {
          this.play("run");
        });
      },
    },
  ]);
}

export function makeRing(position) {
  return k.add([
    k.sprite("ring", { anim: "spin" }),
    k.area(),
    k.scale(3),
    k.anchor("center"),
    k.pos(position),
    k.offscreen(),
    k.z(5),
    "ring",
  ]);
}

export function makeEnemy(position) {
  return k.add([
    k.sprite("bug", { anim: "run" }),
    k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }), // shape of the hit box
    k.scale(3),
    k.anchor("center"),
    k.pos(position),
    k.offscreen(),
    k.z(5),
    "bug",
  ]);
}
