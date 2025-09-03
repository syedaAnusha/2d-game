import k from "./kaplayCtx";
import { makeSonic, makeRing, makeEnemy } from "./entities";

k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("sonic", "graphics/sonic.png", {
  sliceX: 8, // this refers to number of columns in sprite image
  sliceY: 2, // this refers to number of rows in sprite image
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 20 },
    jump: { from: 8, to: 15, loop: true, speed: 90 },
  },
});
k.loadSprite("ring", "graphics/ring.png", {
  sliceX: 16, // this refers to number of columns in sprite image
  sliceY: 1, // this refers to number of rows in sprite image
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 20 },
  },
});
k.loadSprite("bug", "graphics/motobug.png", {
  sliceX: 5, // this refers to number of columns in sprite image
  sliceY: 1, // this refers to number of rows in sprite image
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 5 },
  },
});
k.loadSound("jump", "/sounds/Jump.wav");
k.loadSound("ring", "/sounds/Ring.wav");
k.loadSound("hurt", "/sounds/Hurt.wav");
k.loadSound("destroy", "/sounds/Destroy.wav");
k.loadSound("hyper-ring", "/sounds/HyperRing.wav");
k.loadFont("mania", "fonts/mania.ttf");

k.scene("game", () => {
  let gameSpeed = 100;
  let score = 0;
  let scoreMul = 0;
  k.loop(1, () => {
    gameSpeed += 40;
  });
  const bgPieceWidth = 2880;
  const platformWidth = 2560;
  const sonic = makeSonic(k.vec2(100, 100));
  sonic.setControls();
  sonic.setEvents();
  k.setGravity(3100);
  const ringCollectUI = sonic.add([
    k.text("", { size: 18, font: "mania" }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(30, -10),
  ]);
  const scoreText = k.add([
    k.text(`SCORE : 0`, { size: 38, font: "mania" }),
    k.pos(15, 20),
    k.z(2),
  ]);
  // Setting background object
  const bgPieces = [
    k.add([
      k.sprite("chemical-bg"),
      k.pos(0, 0),
      k.scale(2),
      k.z(1),
      k.opacity(1),
    ]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(bgPieceWidth, 0),
      k.opacity(1),
      k.scale(2),
      k.z(1),
    ]),
  ];
  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(2), k.z(5)]),
    k.add([k.sprite("platforms"), k.pos(2560, 450), k.scale(2), k.z(5)]),
  ];
  // static body for the platforms
  k.add([
    k.rect(1280, 200),
    k.opacity(0),
    k.pos(0, 641),
    k.area(),
    k.z(5),
    k.body({ isStatic: true }),
  ]);
  k.onUpdate(() => {
    // code for city background
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      const frontBgPiece = bgPieces.shift();
      if (frontBgPiece) bgPieces.push(frontBgPiece);
    }
    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(
        platforms[1].pos.x + platformWidth,
        platforms[1].pos.y
      );
      const frontPlatform = platforms.shift();
      if (frontPlatform) platforms.push(frontPlatform);
    }
    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platformWidth, platforms[0].pos.y);
  });

  const spawnRing = () => {
    const ring = makeRing(k.vec2(1280, 610));
    sonic.onCollide("ring", (r) => {
      k.play("ring", { volume: 0.5 });
      k.destroy(r);
      score++;
      scoreText.text = `SCORE : ${score}`;
    });
    ring.onUpdate(() => {
      // code to make the ring move or animate
      ring.move(-gameSpeed, 0);
    });
    ring.onExitScreen(() => {
      k.destroy(ring);
    });
    const waitTime = k.rand(0.5, 3);
    k.wait(waitTime, spawnRing);
  };
  spawnRing();

  const spawnBug = () => {
    const motobug = makeEnemy(k.vec2(1280, 595));
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }
      // code to make the ring move or animate
      motobug.move(-gameSpeed, 0);
    });
    motobug.onExitScreen(() => {
      k.destroy(motobug);
    });
    const waitTime = k.rand(0.5, 2.5);
    k.wait(waitTime, spawnBug);
  };
  spawnBug();

  sonic.onCollide("ring", (r) => {
    ringCollectUI.text = "+1";
    k.wait(1, () => {
      ringCollectUI.text = "";
    });
  });

  sonic.onCollide("bug", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      scoreMul += 1;
      score += 10 * scoreMul;
      scoreText.text = `SCORE : ${score}`;
      if (scoreMul === 1) {
        ringCollectUI.text = `+${10 * scoreMul}`;
      }
      if (scoreMul > 1) {
        ringCollectUI.text = `x${scoreMul}`;
      }
      k.wait(1, () => {
        ringCollectUI.text = "";
      });
      return;
    }
    k.play("hurt", { volume: 0.5 });
    k.setData("current-score", score);
    k.go("game-over");
  });
  sonic.onGround(() => {
    scoreMul = 0;
  });
});
k.scene("game-over", () => {
  let bestScore = k.getData("best-score") || 0;
  let currentScore = k.getData("current-score") || 0;
  if (currentScore && bestScore < currentScore) {
    k.setData("best-score", currentScore);
    bestScore = currentScore;
  }
  k.add([
    k.text("GAME OVER", { size: 64, font: "mania" }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 300),
  ]);

  k.add([
    k.text("BEST SCORE", { size: 32, font: "mania" }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y - 200),
  ]);

  k.add([
    k.text(`${bestScore}`, { size: 48, font: "mania" }),
    k.color(255, 215, 0), // Gold color for best score
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y - 130),
  ]);

  k.add([
    k.text("CURRENT SCORE", { size: 32, font: "mania" }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y - 200),
  ]);

  k.add([
    k.text(`${currentScore}`, { size: 48, font: "mania" }),
    k.color(255, 255, 255), // White color for current score
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y - 130),
  ]);
  k.wait(1, () => {
    k.add([
      k.text("Press Space/Click/Touch to Play Again", {
        size: 32,
        font: "mania",
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 200),
    ]);
    k.onButtonPress(() => {
      k.go("game");
    });
  });
});
k.go("game");
