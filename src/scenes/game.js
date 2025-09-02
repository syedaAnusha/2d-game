import k from "../kaplayCtx";
import { makeBasket } from "../entities/basket";
import { makeOrange, makeMango } from "../entities/fruit";

export default function game() {
  // Background music
  const bgMusic = k.play("bgMusic", { volume: 0.2, loop: true });

  // Game variables
  let score = 0;
  let gameSpeed = 1;
  let colorChangeTimer = 0;

  // Background
  const bg = k.add([k.sprite("background"), k.scale(1), k.pos(0, 0)]);

  // Add score display
  const scoreText = k.add([
    k.text("SCORE: 0", { size: 48, font: "gameFont" }),
    k.pos(20, 20),
  ]);

  // Create basket
  const basket = makeBasket(k.vec2(k.center().x, k.height() - 100));

  // Basket controls
  k.onKeyDown("left", () => {
    if (basket.pos.x > 50) basket.move(-500, 0);
  });

  k.onKeyDown("right", () => {
    if (basket.pos.x < k.width() - 50) basket.move(500, 0);
  });

  // Touch/mouse controls for mobile
  k.onMouseMove((pos) => {
    basket.pos.x = pos.x;
  });

  // Randomly change basket color
  k.loop(3, () => {
    basket.changeColor();
  });

  // Spawn fruits
  const spawnFruit = () => {
    const fruitType = k.rand(0, 1) > 0.5 ? "mango" : "orange";
    const xPos = k.rand(50, k.width() - 50);

    if (fruitType === "mango") {
      const mango = makeMango(k.vec2(xPos, -50));
      setFruitBehavior(mango);
    } else {
      const orange = makeOrange(k.vec2(xPos, -50));
      setFruitBehavior(orange);
    }

    // Increase difficulty over time
    const waitTime = k.rand(0.5, 2) / gameSpeed;
    k.wait(waitTime, spawnFruit);
  };

  const setFruitBehavior = (fruit) => {
    // When fruit goes off screen
    fruit.onUpdate(() => {
      if (fruit.pos.y > k.height() + 50) {
        k.destroy(fruit);
        // Optional: penalty for missing
      }
    });
  };

  // Collision detection
  k.onCollide("fruit", "basket", (fruit, basket) => {
    // Check if basket color matches fruit type
    const correctCatch =
      (fruit.is("orange") && basket.currentColor === "orange") ||
      (fruit.is("mango") && basket.currentColor === "yellow");

    if (correctCatch) {
      k.play("catch", { volume: 0.5 });
      score += 10;
      scoreText.text = `SCORE: ${score}`;
    } else {
      k.play("wrong", { volume: 0.5 });
      // Optional: penalty for wrong color
    }

    k.destroy(fruit);
  });

  // Start game
  spawnFruit();

  // Increase game speed over time
  k.loop(10, () => {
    gameSpeed += 0.1;
  });

  // Game over condition
  k.onKeyPress("escape", () => {
    k.setData("current-score", score);
    k.go("game-over", bgMusic);
  });
}
